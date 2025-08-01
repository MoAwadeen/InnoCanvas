import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Shield, BarChart3, Clock } from "lucide-react";

export default function Hero() {
  const features = [
    {
      icon: <Shield className="w-5 h-5 text-green-600" />,
      text: "Private & Secure",
      isActive: true,
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      text: "Real-Time Insights",
      isActive: true,
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      text: "Automated Follow-Ups",
      isActive: true,
    },
  ];

  return (
    <section className="relative w-full max-w-[1920px] mx-auto pt-[74px] bg-[#f7f7f5]">
      <div className="relative w-full max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-[102px]">
          <div className="max-w-[740px] mb-6">
            <h1 className="font-medium text-neutral-950 text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight">
              Reimagine Your
              <br />
              <span className="inline-block mt-[10px]">BMC With AI</span>
            </h1>
          </div>

          <div className="max-w-[514px] mb-10">
            <p className="font-normal text-[#5b5b5b] text-lg tracking-tight leading-relaxed">
              An Intelligent Co-Founder for the First Step of Your Startup.
            </p>
            <p className="font-normal text-[#5b5b5b] text-lg tracking-tight leading-relaxed mt-2">
              Each canvas is uniquely generated for your business.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button className="h-[52px] px-8 rounded-xl bg-neutral-950 hover:bg-neutral-800 font-medium text-sm text-white">
                Get 14 Days Free Trial
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                variant="outline"
                className="h-[52px] px-8 rounded-xl border-neutral-950 font-medium text-neutral-950 text-sm hover:bg-neutral-100"
              >
                Book A Free Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative w-full">
          <div className="flex justify-center mb-16">
            <Badge className="h-[43px] px-6 py-2 bg-white text-foreground rounded-full flex items-center gap-4 shadow-sm">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <div className="w-2 h-2 bg-[#3b3b3b1f] rounded-full"></div>
                  )}
                  <div className="flex items-center">
                    <span className="mr-2">{feature.icon}</span>
                    <span
                      className={`font-medium text-base ${feature.isActive ? "text-neutral-950" : "text-[#5b5b5b]"}`}
                    >
                      {feature.text}
                    </span>
                  </div>
                </div>
              ))}
            </Badge>
          </div>

          <Card className="w-full h-[400px] md:h-[686px] bg-[#ffffff8a] rounded-[32px] overflow-hidden shadow-[0px_8px_32px_#00000014] backdrop-blur-[27px] backdrop-brightness-[100%]">
            <div className="relative w-[calc(100%-32px)] h-[calc(100%-32px)] m-4 rounded-3xl bg-gradient-to-br from-yellow-200 via-orange-300 to-red-600 flex items-center justify-center">
              {/* Dashboard Preview */}
              <div className="w-full max-w-4xl h-full bg-white/90 rounded-2xl p-6 m-4 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-neutral-950">InnoCanvas Dashboard</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-600">AI Active</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-2">Business Model Canvas</h4>
                    <p className="text-sm text-blue-700">AI-generated canvas ready for review</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-900 mb-2">AI Insights</h4>
                    <p className="text-sm text-green-700">3 new suggestions available</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                    <h4 className="font-semibold text-purple-900 mb-2">Export Ready</h4>
                    <p className="text-sm text-purple-700">PDF download available</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
