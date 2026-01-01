"use client";

import { toast } from "sonner";
import { Check } from "lucide-react";

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

export default function Pricing() {
    const handleSubscribe = () => {
        toast.success("Payment successful (test mode)");
    };

    const plans = [
        {
            name: "Basic",
            description: "Essential features for individuals.",
            price: "$9",
            features: [
                "10 Job Applications/mo",
                "Basic Profile",
                "Email Support",
                "Access to Job Board",
            ],
            popular: false,
        },
        {
            name: "Pro",
            description: "Perfect for active job seekers.",
            price: "$29",
            features: [
                "Unlimited Applications",
                "Featured Profile",
                "Priority Email Support",
                "Resume Review",
                "Salary Insights",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            description: "For agencies and large teams.",
            price: "$99",
            features: [
                "Everything in Pro",
                "Dedicated Account Manager",
                "API Access",
                "Custom Branding",
                "Team Collaboration",
                "Advanced Analytics",
            ],
            popular: false,
        },
    ];

    return (
        <div className="container mx-auto py-16 px-4 md:px-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Simple, Transparent Pricing
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Choose the plan that's right for your career journey.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`flex flex-col relative ${plan.popular
                            ? "border-primary shadow-lg scale-105 z-10"
                            : "border-border"
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
                                onClick={handleSubscribe}
                            >
                                Subscribe
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
