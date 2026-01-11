import { env } from "@/lib/env";
import { PricingCards } from "@/components/features/pricing/pricing-cards";

export const metadata = {
    title: "Pricing | JobBoard",
    description: "Choose the plan that's right for your career journey.",
};

export default function PricingPage() {
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
            priceId: env.STRIPE_PRICE_ID, // Securely injected from server env
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
                    Choose the plan that&apos;s right for your career journey.
                </p>
            </div>

            <PricingCards plans={plans} />
        </div>
    );
}
