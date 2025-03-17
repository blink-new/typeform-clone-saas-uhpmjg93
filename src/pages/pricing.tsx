import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subscriptionPlans } from '@/lib/mock-data';
import { useAuth } from '@/contexts/auth-context';
import { CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function PricingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(user?.plan || null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose the right plan for you</h1>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're just getting started or need advanced features, we have a plan that's right for you.
          </p>

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  billingCycle === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  billingCycle === 'yearly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="text-green-600 font-normal">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`overflow-hidden ${plan.id === 'pro' ? 'border-primary ring-1 ring-primary' : ''}`}>
                {plan.id === 'pro' && (
                  <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.id === 'free' ? 'Perfect for getting started' : 
                     plan.id === 'pro' ? 'For professionals and growing teams' : 
                     'For larger organizations with advanced needs'}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${billingCycle === 'yearly' ? (plan.price * 0.8).toFixed(0) : plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 ml-1">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.id === selectedPlan ? 'bg-primary' : ''}`}
                    variant={plan.id === selectedPlan ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === selectedPlan ? 'Current Plan' : plan.id === 'free' ? 'Get Started' : 'Upgrade'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Compare Plans</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left font-medium text-gray-500">Feature</th>
                  {subscriptionPlans.map(plan => (
                    <th key={plan.id} className="py-4 px-6 text-center font-medium text-gray-500">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Forms</td>
                  {subscriptionPlans.map(plan => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {plan.limits.forms === Infinity ? 'Unlimited' : plan.limits.forms}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Responses per month</td>
                  {subscriptionPlans.map(plan => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {plan.limits.responsesPerMonth === Infinity ? 'Unlimited' : plan.limits.responsesPerMonth}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Question types</td>
                  {subscriptionPlans.map(plan => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {plan.limits.questionTypes.length}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Custom branding</td>
                  {subscriptionPlans.map(plan => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {plan.limits.customBranding ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Team members</td>
                  {subscriptionPlans.map(plan => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {plan.limits.teamMembers}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Analytics</td>
                  {subscriptionPlans.map((plan, index) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {index === 0 ? 'Basic' : index === 1 ? 'Advanced' : 'Enterprise'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 font-medium">Priority support</td>
                  {subscriptionPlans.map((plan, index) => (
                    <td key={plan.id} className="py-4 px-6 text-center">
                      {index === 2 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact our sales team for a custom quote or to learn more about our enterprise options.
          </p>
          <Button size="lg">Contact Sales</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}