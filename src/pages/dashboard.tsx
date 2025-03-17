import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockForms } from '@/lib/mock-data';
import { Form } from '@/lib/types';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, BarChart, Copy, Trash, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const [forms, setForms] = useState<Form[]>(mockForms);

  const deleteForm = (formId: string) => {
    setForms(forms.filter(form => form.id !== formId));
  };

  const duplicateForm = (form: Form) => {
    const newForm: Form = {
      ...form,
      id: `form-${Date.now()}`,
      title: `${form.title} (Copy)`,
      published: false,
      responses: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setForms([...forms, newForm]);
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{forms.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{forms.reduce((sum, form) => sum + form.responses, 0)}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Published Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{forms.filter(form => form.published).length}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Forms</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form, index) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{form.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {form.description || 'No description'}
                      </CardDescription>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${form.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {form.published ? 'Published' : 'Draft'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    <div className="flex justify-between mb-2">
                      <span>Responses:</span>
                      <span className="font-medium text-gray-900">{form.responses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-medium text-gray-900">{form.questions.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BarChart className="h-4 w-4 mr-1" />
                      Results
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => duplicateForm(form)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteForm(form.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}