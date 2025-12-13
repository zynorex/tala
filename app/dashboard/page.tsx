'use client';

import { BarChart3, Lock, Users, Zap, TrendingUp, Calendar, CheckCircle, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const stats = [
    {
      label: "Total Vaults",
      value: "8",
      change: "+2 this month",
      icon: Lock,
      color: "border-heirlock-blue",
    },
    {
      label: "Papers Protected",
      value: "1,247",
      change: "+340 this month",
      icon: CheckCircle,
      color: "border-heirlock-green",
    },
    {
      label: "Students Authorized",
      value: "3,456",
      change: "+890 this month",
      icon: Users,
      color: "border-heirlock-pink",
    },
    {
      label: "Gas Saved",
      value: "$4,230",
      change: "With free check-ins",
      icon: Zap,
      color: "border-heirlock-yellow",
    },
  ];

  const recentVaults = [
    {
      name: "Final Exam 2024",
      school: "IIT Delhi",
      students: 450,
      unlocksIn: "2 days",
      status: "Active",
    },
    {
      name: "Midterm Paper",
      school: "Stanford University",
      students: 320,
      unlocksIn: "5 hours",
      status: "Active",
    },
    {
      name: "Quiz Round 3",
      school: "MIT",
      students: 180,
      unlocksIn: "Completed",
      status: "Completed",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-heirlock-blue border-b-4 border-black py-12 md:py-20 pt-24 md:pt-32">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="space-y-4 md:space-y-6 flex justify-between items-start">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
                Dashboard
              </h1>
              <p className="text-lg md:text-xl text-black max-w-3xl mt-4">
                Welcome back! Here's your vault overview.
              </p>
            </div>
            <Link href="/create-vault">
              <button className="px-6 py-3 bg-black text-heirlock-blue font-bold border-4 border-black hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                New Vault
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`border-4 ${stat.color} bg-white p-6 shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Icon className="w-8 h-8 text-black" />
                    <TrendingUp className="w-5 h-5 text-black" />
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className={`text-xs ${
                    stat.color.includes('blue') ? 'text-heirlock-blue' :
                    stat.color.includes('green') ? 'text-heirlock-green' :
                    stat.color.includes('pink') ? 'text-heirlock-pink' :
                    'text-heirlock-yellow'
                  }`}>{stat.change}</p>
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Vaults */}
            <div className="lg:col-span-2">
              <div className="border-4 border-black bg-white p-8 shadow-brutal">
                <h2 className="text-2xl font-bold mb-6">Recent Vaults</h2>
                <div className="space-y-4">
                  {recentVaults.map((vault, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 border-4 border-black hover:shadow-brutal transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{vault.name}</h3>
                          <p className="text-sm text-gray-600">{vault.school}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded border-2 ${
                            vault.status === "Active"
                              ? "bg-heirlock-green text-black border-heirlock-green"
                              : "bg-gray-400 text-white border-gray-400"
                          }`}
                        >
                          {vault.status}
                        </span>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Students</p>
                          <p className="font-bold">{vault.students}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            {vault.status === "Active" ? "Unlocks In" : "Unlocked"}
                          </p>
                          <p className="font-bold">{vault.unlocksIn}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="border-4 border-black bg-white p-8 shadow-brutal">
                <Settings className="w-8 h-8 text-black mb-4" />
                <h3 className="text-xl font-bold mb-3">Settings</h3>
                <p className="text-gray-700 text-sm mb-6">Manage your profile and account preferences.</p>
                <button className="w-full border-4 border-black text-black px-4 py-2 font-bold rounded hover:bg-black hover:text-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  Account Settings
                </button>
              </div>

              <div className="border-4 border-black bg-white p-8 shadow-brutal">
                <Calendar className="w-8 h-8 text-black mb-4" />
                <h3 className="text-xl font-bold mb-3">Upcoming</h3>
                <p className="text-gray-700 text-sm mb-6">3 vaults scheduled to unlock this week.</p>
                <button className="w-full border-4 border-black text-black px-4 py-2 font-bold rounded hover:bg-black hover:text-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  View Calendar
                </button>
              </div>

              <div className="border-4 border-black bg-white p-8 shadow-brutal">
                <BarChart3 className="w-8 h-8 text-black mb-4" />
                <h3 className="text-xl font-bold mb-3">Analytics</h3>
                <p className="text-gray-700 text-sm mb-6">Detailed stats on your vault activity.</p>
                <button className="w-full border-4 border-black text-black px-4 py-2 font-bold rounded hover:bg-black hover:text-white shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 md:py-20 bg-black border-t-4 border-heirlock-blue">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <div className="border-4 border-heirlock-blue bg-black p-12 shadow-brutal">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-heirlock-blue">Need Help?</h2>
            <p className="text-gray-300 mb-8">
              Check our documentation or contact support for assistance with your vaults.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/documentation">
                <button className="bg-heirlock-blue text-black px-6 py-3 font-bold border-4 border-heirlock-blue hover:bg-white hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  Documentation
                </button>
              </Link>
              <a
                href="mailto:support@tala.edu"
                className="border-4 border-heirlock-blue text-heirlock-blue px-6 py-3 font-bold rounded hover:bg-heirlock-blue hover:text-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
