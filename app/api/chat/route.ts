import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (process.env.ENABLE_CHAT_AI !== 'true') {
      return new NextResponse('AI chat is currently disabled by the developer and will open soon.', { status: 503 });
    }

    const { messages } = (await req.json()) as { messages: UIMessage[] };

    // Verify User Authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch User from Database for Rate Limiting & Plan check
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        plan: true,
        // aiChatCount: true
      }
    });

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Rate Limiting Logic: Max 3 chats for FREE users
    // Commented out since aiChatCount is temporarily removed
    /*
    if (dbUser.plan === 'FREE' && dbUser.aiChatCount >= 3) {
      return new NextResponse(
        'You have reached your 3 free chat limit. Please upgrade to a premium plan.', 
        { status: 403 }
      );
    }

    // Increment Chat Count for FREE users
    if (dbUser.plan === 'FREE') {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          aiChatCount: {
            increment: 1
          }
        }
      });
    }
    */

    // Base System Prompt containing Context
    const systemPromptText = `
    You are an expert AI Support Assistant for Tala, a Web3 Vault Application. 
    Tala allows users to securely lock files and set specific unlock times. 
    You are interacting with a user whose plan is currently ${dbUser.plan}.
    Be concise, helpful, and polite. If you do not know the answer, state that you do not know.
    `;

    // Process chat with AI SDK Streamed Response
    const result = streamText({
      model: openai('gpt-4o-mini'), // Change to gpt-4o or claude-3 as needed
      system: systemPromptText,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('Chat API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
