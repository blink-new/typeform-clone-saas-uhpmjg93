import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockForms, mockResponses } from '@/lib/mock-data';
import { Form, Response, Answer } from '@/lib/types';
import { ArrowLeft, Download, Clock, Users, BarChart2, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export function FormAnalyticsPage() {
  // In a real app, we would get the form ID from the URL
  const formId = 'form-1';
  const [activeTab, setActiveTab] = useState('overview');
  
  const form = mockForms.find(f => f.id === formId);
  const responses = mockResponses.filter(r => r.formId === formId);
  
  if (!form) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">Form not found</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate completion rate
  const completionRate = responses.length > 0 
    ? (responses.filter(r => r.completed).length / responses.length) * 100 
    : 0;

  // Calculate average completion time
  const completionTimes = responses
    .filter(r => r.completed && r.completedAt && r.createdAt)
    .map(r => {
      const start = new Date(r.createdAt).getTime();
      const end = new Date(r.completedAt!).getTime();
      return (end - start) / 1000; // in seconds
    });
  
  const averageCompletionTime = completionTimes.length > 0
    ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
    : 0;

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Generate question response data for charts
  const getQuestionResponseData = (questionId: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (!question) return [];

    if (question.type === 'multiple_choice' || question.type === 'single_choice') {
      const optionCounts: Record<string, number> = {};
      
      // Initialize all options with 0 count
      question.options?.forEach(option => {
        optionCounts[option] = 0;
      });
      
      // Count responses for each option
      responses.forEach(response => {
        const answer = response.answers.find(a => a.questionId === questionId);
        if (answer) {
          if (Array.isArray(answer.value)) {
            // Multiple choice
            answer.value.forEach(option => {
              optionCounts[option as string] = (optionCounts[option as string] || 0) + 1;
            });
          } else {
            // Single choice
            optionCounts[answer.value as string] = (optionCounts[answer.value as string] || 0) + 1;
          }
        }
      });
      
      // Convert to array for charts
      return Object.entries(optionCounts).map(([option, count]) => ({
        name: option,
        value: count,
      }));
    }
    
    if (question.type === 'rating') {
      const ratingCounts: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
      
      // Count responses for each rating
      responses.forEach(response => {
        const answer = response.answers.find(a => a.questionId === questionId);
        if (answer && typeof answer.value === 'number') {
          ratingCounts[answer.value] = (ratingCounts[answer.value] || 0) + 1;
        }
      });
      
      // Convert to array for charts
      return Object.entries(ratingCounts).map(([rating, count]) => ({
        name: `${rating} Star${Number(rating) !== 1 ? 's' : ''}`,
        value: count,
      }));
    }
    
    if (question.type === 'yes_no') {
      let yesCount = 0;
      let noCount = 0;
      
      // Count yes/no responses
      responses.forEach(response => {
        const answer = response.answers.find(a => a.questionId === questionId);
        if (answer) {
          if (answer.value === true) yesCount++;
          if (answer.value === false) noCount++;
        }
      });
      
      return [
        { name: 'Yes', value: yesCount },
        { name: 'No', value: noCount },
      ];
    }
    
    return [];
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{form.title} - Analytics</h1>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export Data
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="responses">Individual Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Total Responses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{responses.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{completionRate.toFixed(1)}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Avg. Completion Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatTime(averageCompletionTime)}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Response Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { date: 'May 17', count: 1 },
                        { date: 'May 18', count: 1 },
                        { date: 'May 19', count: 0 },
                        { date: 'May 20', count: 2 },
                        { date: 'May 21', count: 3 },
                        { date: 'May 22', count: 5 },
                        { date: 'May 23', count: 4 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0284c7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: 'Desktop', value: 12 },
                            { name: 'Mobile', value: 8 },
                            { name: 'Tablet', value: 4 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Desktop', value: 12 },
                            { name: 'Mobile', value: 8 },
                            { name: 'Tablet', value: 4 },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { name: 'Started', value: 24 },
                          { name: 'Question 1', value: 22 },
                          { name: 'Question 2', value: 20 },
                          { name: 'Question 3', value: 18 },
                          { name: 'Question 4', value: 16 },
                          { name: 'Completed', value: 16 },
                        ]}
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0284c7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-0">
            <div className="space-y-8">
              {form.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle>
                      Question {index + 1}: {question.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(question.type === 'multiple_choice' || question.type === 'single_choice' || question.type === 'rating' || question.type === 'yes_no') ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getQuestionResponseData(question.id)}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#0284c7" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={getQuestionResponseData(question.id)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {getQuestionResponseData(question.id).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-500">Text responses:</p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {responses.map((response, i) => {
                            const answer = response.answers.find(a => a.questionId === question.id);
                            return answer ? (
                              <div key={i} className="p-3 bg-gray-50 rounded-md">
                                {answer.value as string}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="responses" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium text-gray-500">ID</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((response) => (
                        <tr key={response.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{response.id}</td>
                          <td className="py-3 px-4 text-gray-900">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              response.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {response.completed ? 'Completed' : 'Partial'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}