import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FormProvider, useForm } from '../contexts/FormContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircle, Edit, BarChart2, Trash2, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <FormProvider>
      <DashboardContent />
    </FormProvider>
  );
};

const DashboardContent = () => {
  const { forms, loading, deleteForm } = useForm();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateForm = () => {
    navigate('/forms/create');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteForm = (e, formId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this form?')) {
      deleteForm(formId);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FormFlow</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {currentUser?.name || 'User'}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center">
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
          <Button onClick={handleCreateForm} className="flex items-center">
            <PlusCircle size={16} className="mr-2" /> Create Form
          </Button>
        </div>

        {forms.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-500 mb-4">Create your first form to start collecting responses</p>
            <Button onClick={handleCreateForm} className="flex items-center mx-auto">
              <PlusCircle size={16} className="mr-2" /> Create Form
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{form.title}</CardTitle>
                  <CardDescription>
                    {form.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{form.questions?.length || 0} questions</span>
                    <span>{form.responses?.length || 0} responses</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/forms/${form.id}`)}
                      className="flex items-center"
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/forms/${form.id}/view`)}
                      className="flex items-center"
                    >
                      <BarChart2 size={14} className="mr-1" /> View
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => handleDeleteForm(e, form.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;