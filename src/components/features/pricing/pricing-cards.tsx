"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSession } from "@/actions/stripe";
import { features } from "@/lib/env";

interface Plan {
    name: string;
    description: string;
    price: string;
    features: string[];
    popular: boolean;
    priceId?: string;
}

interface PricingCardsProps {
    plans: Plan[];
}

export function PricingCards({ plans }: PricingCardsProps) {
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

    const handleSubscribe = async (plan: Plan) => {
        // Demo mode - payments disabled
        if (!features.paymentsEnabled) {
            toast.info("💡 Payment Demo Mode", {
                description: "This is a demo project. In production, this would redirect to Stripe Checkout.",
                duration: 5000,
            });
            return;
        }

        if (!plan.priceId) {
            toast.info("This plan is not available yet.");
            return;
        }

        setLoadingPriceId(plan.priceId);
        try {
            const result = await createCheckoutSession(plan.priceId);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.url) {
                // Redirect to Stripe Checkout
                window.location.href = result.url;
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error(error);
        } finally {
            setLoadingPriceId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
                <Card
                    key={plan.name}
                    className={`flex flex-col relative transition-all duration-300 ${plan.popular
                        ? "border-primary shadow-lg scale-105 z-10 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/50"
                        }`}
                >
                    {plan.popular && (
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                            <Badge className="px-3 py-1 text-sm bg-primary text-primary-foreground">
                                Most Popular
                            </Badge>
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="mb-6">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-3">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start">
                                    <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                                    <span className="text-sm text-muted-foreground">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            variant={plan.popular ? "default" : "outline"}
                            onClick={() => handleSubscribe(plan)}
                            disabled={loadingPriceId !== null}
                        >
                            {loadingPriceId === plan.priceId ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            {features.paymentsEnabled ? "Subscribe" : "View Demo"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
