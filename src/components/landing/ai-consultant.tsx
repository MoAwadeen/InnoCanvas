import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageSquare, Rocket, Target, Users, DollarSign } from "lucide-react";

export default function AIConsultant() {
  const promptButtons = [
    { text: "Help me validate this startup idea.", width: "w-[291px]" },
    { text: "Feature priority?", width: "w-[157px]" },
    { text: "How can I attract my first 100 customers?", width: "w-[347px]" },
    { text: "Set my pricing.", width: "w-[145px]" },
  ];

  const actionButtons = [
    {
      text: "Ask.",
      width: "w-[65px]",
      position: "top-[17px] left-1 rotate-[-18deg]",
      icon: <MessageSquare className="w-4 h-4" />
    },
    { 
      text: "Launch.", 
      width: "w-[93px]", 
      position: "top-10 left-[246px]",
      icon: <Rocket className="w-4 h-4" />
    },
    {
      text: "Save.",
      width: "w-[75px]",
      position: "top-[157px] left-0.5 rotate-[7deg]",
      icon: <Users className="w-4 h-4" />
    },
    {
      text: "Boost.",
      width: "w-20",
      position: "top-[206px] left-[129px] rotate-[17deg]",
      icon: <Target className="w-4 h-4" />
    },
    {
      text: "Map.",
      width: "w-[71px]",
      position: "-top-16 left-0.5 rotate-[7deg]",
      icon: <Brain className="w-4 h-4" />
    },
    {
      text: "Scale.",
      width: "w-[79px]",
      position: "top-[-65px] left-[150px] rotate-[4deg]",
      icon: <Rocket className="w-4 h-4" />
    },
  ];

  return (
    <section className="w-full py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-medium text-neutral-950 text-center tracking-tight leading-tight mb-16 max-w-[966px] mx-auto">
          Turn Your Idea Into a Business in Under 5 Minutes.
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          {/* Left Card - AI Business Consultant */}
          <Card className="w-full lg:w-[508px] h-[611px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 border-none">
            <CardContent className="p-12">
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="ml-4 font-medium text-white text-2xl md:text-3xl tracking-tight leading-tight">
                    AI Business Consultant
                  </h3>
                </div>

                <div className="font-medium text-white text-lg md:text-xl tracking-tight leading-relaxed mb-4">
                  Validate your startup ideas, refine <br />
                  your value proposition, and define <br />
                  your ideal customer.
                </div>

                <div className="font-medium text-white text-base md:text-lg tracking-tight leading-relaxed">
                  This AI thinks like a founder, <br />
                  strategist, and incubator mentor.
                </div>
              </div>

              <div className="space-y-3">
                {promptButtons.map((button, index) => (
                  <div
                    key={index}
                    className={`${button.width} h-[37px] bg-white rounded-[19px] overflow-hidden relative`}
                  >
                    <div className="relative h-[37px] rounded-[19px]">
                      <div className="absolute top-[7px] left-4 font-normal text-neutral-950 text-base tracking-[0] leading-[27.2px] whitespace-nowrap">
                        {button.text}
                      </div>
                      <div className="absolute w-full h-full top-0 left-0 rounded-[19px] border-[3px] border-solid border-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Card - Action Buttons */}
          <Card className="w-full lg:w-[508px] h-[611px] rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-0 relative h-full">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Center square */}
                <div className="relative w-[199px] h-[200px] rounded-[40px] overflow-hidden">
                  <div className="h-[200px] rounded-[40px] border-[3px] border-solid border-red-600 bg-gradient-to-br from-yellow-200 via-orange-300 to-red-600 flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-12 h-12 text-white mx-auto mb-2" />
                      <p className="text-white font-semibold">AI Ready</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons around the square */}
                {actionButtons.map((button, index) => (
                  <div
                    key={index}
                    className={`absolute ${button.width} h-[37px] ${button.position} bg-white rounded-[19px] overflow-hidden shadow-lg`}
                  >
                    <div className="relative h-[37px] rounded-[19px]">
                      <div className="absolute top-[7px] left-4 font-normal text-neutral-950 text-base tracking-[0] leading-[27.2px] whitespace-nowrap flex items-center gap-2">
                        {button.icon}
                        {button.text}
                      </div>
                      <div className="absolute w-full h-full top-0 left-0 rounded-[19px] border-[3px] border-solid border-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 