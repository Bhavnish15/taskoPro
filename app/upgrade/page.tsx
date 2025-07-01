"use client";

import { useAuth } from "@/hooks/useAuth";
import { useVIPLevels } from "@/hooks/useDatabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Crown, Check, Zap, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 1️⃣ Define your default costs (level 1 through 6)
export const defaultCosts: Record<number, number> = {
  1: 0,    // free
  2: 50,
  3: 100,
  4: 150,
  5: 200,
  6: 250,
};


export default function UpgradePage() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const { vipLevels, loading: vipLoading, error: vipError, } = useVIPLevels();

  const { toast } = useToast();
  const router = useRouter()


  const handleUpgrade = (level: number, cost: number) => {
    if (!user) return;
     router.push(`/payment?level=${level}&cost=${cost}`);
    // if (user.wallet < cost) {
    //   toast({
    //     title: "Insufficient Credits",
    //     description: "You don't have enough credits for this upgrade.",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    // try {
    //   await updateUser({
    //     vipLevel: level,
    //     wallet: user.wallet - cost,
    //   });
    //   toast({
    //     title: "🎉 Upgrade Successful!",
    //     description: `Welcome to VIP Level ${level}! Enjoy your new benefits!`,
    //   });
    // } catch {
    //   toast({
    //     title: "Upgrade Failed",
    //     description: "Something went wrong. Please try again.",
    //     variant: "destructive",
    //   });
    // }
  };

  if (authLoading || vipLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">
            Loading VIP levels...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      router.push("/")
      // <div className="min-h-screen flex items-center justify-center">
      //   <Card className="w-full max-w-md">
      //     <CardContent className="text-center py-8">
      //       <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      //       <p className="text-xl text-muted-foreground mb-4">
      //         Please sign in to view VIP upgrades.
      //       </p>
      //       <Link href="/auth">
      //         <Button>Sign In</Button>
      //       </Link>
      //     </CardContent>
      //   </Card>
      // </div>
    );
  }

  if (vipError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">
              Error Loading VIP Levels
            </h2>
            <p className="text-muted-foreground mb-4">
              {vipError}
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayedLevels = [1, 2, 3, 4, 5, 6].map((lvl) => {
    const data = vipLevels.find((v) => v.level === lvl);
    return (
      data ?? {
        level: lvl,
        name: `VIP ${lvl}`,
        cost: defaultCosts[lvl] || 0,
        description: "Unlock awesome benefits",
        color: "gray",
        price: "",
        timeReduction: 0,
        benefits: [],
      }
    );
  });

  const currentVIP = displayedLevels.find(
    (level) => level.level === user.vipLevel
  );

  // simple color map for avatar circle
  const colorClasses: Record<string, string> = {
    gray: "bg-gray-100 text-gray-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Crown className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">VIP Upgrades</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upgrade your VIP level to unlock faster task completion, better
          rewards, and exclusive benefits
        </p>

        {/* Current Status */}
        <div className="mt-8 flex justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Current Level
                </Badge>
                <h3 className="text-2xl font-bold text-primary">
                  {currentVIP?.name}
                </h3>
                <p className="text-muted-foreground">
                  Level {user.vipLevel}
                </p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Wallet Balance
                  </p>
                  <p className="text-2xl font-bold">
                    {user.wallet.toLocaleString()} credits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* VIP Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {displayedLevels.map((level) => {
          const isCurrent = user.vipLevel === level.level;
          const canUpgrade =
            user.vipLevel < level.level && user.wallet >= level.cost;
          const isNext = user.vipLevel + 1 === level.level;

          return (
            <Card
              key={level.level}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${isCurrent ? "ring-2 ring-primary shadow-lg" : ""
                } ${isNext ? "border-primary/50" : ""}`}
            >
              {isCurrent && (
                <div className="absolute inset-x-0 top-0 bg-primary text-primary-foreground text-center py-1 text-xs font-medium">
                  CURRENT LEVEL
                </div>
              )}
              {isNext && !isCurrent && (
                <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-1 text-xs font-medium">
                  RECOMMENDED
                </div>
              )}

              <CardHeader
                className={`text-center ${isCurrent || isNext ? "pt-8" : "pt-6"
                  }`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[level.color] ?? colorClasses.gray
                      }`}
                  >
                    <Crown className="w-8 h-8" />
                  </div>
                </div>
                <CardTitle className="text-xl">{level.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Level {level.level}
                </p>
                <div className="mt-4">
                  {level.cost === 0 ? (
                    <div className="text-2xl font-bold text-green-600">
                      {level.cost}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">
                      {level.cost.toLocaleString()}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        omr(﷼)
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  {level.description}
                </p>

                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">
                      {Math.round((1 - level.timeReduction) * 100)}% Faster
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Task completion speed
                  </p>
                </div>

                <div className="space-y-2">
                  {level.benefits.slice(0, 4).map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  {isCurrent ? (
                    <Badge>Current</Badge>
                  ) : (
                    <Button onClick={() => handleUpgrade(level.level, level.cost)}>
                      {level.cost === 0
                        ? `Upgrade to ${level.name} (Free)`
                        : `Proceed to Payment`}
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
