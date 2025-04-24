import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { notify } from '@/hooks/toastUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import OpsBeatLogo from '../../assets/logo/OpsBeat-Logo.svg';
import { userLogin } from '@/utils/axios';

const hostName = window.location.hostname;

// Zod schema for validation
const loginSchema = z.object({
  username: z.string().min(1, 'Email Id is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  persistent: z.boolean()
});

type LoginFormValues = z.infer<typeof loginSchema>;

function AuthLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      persistent: localStorage.getItem('persistent') === 'true'
    }
  });

  useEffect(() => {
    const subscription = form.watch(() => setErrorMessage(''));
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    // console.log('Default Values on Mount:', form.getValues());
    const persistent = localStorage.getItem('persistent');
    if (persistent) {
      const data = JSON.parse(atob(persistent));
      form.reset(data);
    }
  }, [form]);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await userLogin(data);
      if (response?.status) {
        navigate('/');
        notify.success('Login successful');
      }

      console.log('Login Response:', response);
      if (response.statusCode === 400) {
        setErrorMessage('Incorrect Email Id or password.');
        return;
      }

      if (response.statusCode !== 200) {
        setErrorMessage(response?.message);
        return;
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#13122a] p-4 lg:w-1/2">
      {hostName !== 'mahb.dglide.com' && hostName !== 'dev.ops-beat.com' ? (
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-36 w-36 items-center">
            <img
              src={'https://opsbeats.s3.ap-south-1.amazonaws.com/logo/logo.svg'}
              alt="Logo"
            />
          </div>
        </div>
      ) : (
        <div className="mb-8 flex items-center">
          <div className="flex h-12 w-44 items-center">
            <img className="h-[3.5rem]" alt="logo" src={OpsBeatLogo} />
          </div>
        </div>
      )}
      <Card className="w-full max-w-[350px]">
        <CardHeader className="">
          <CardTitle className="flex">Login</CardTitle>
          <CardDescription className="flex">
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login Button */}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                console.log('Form Data:', data);
                onSubmit(data);
              })}
              className="space-y-6"
            >
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Id</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Email Id" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <div
                          className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="flex h-[3rem] w-full items-end">
                  <div className="flex h-10 w-full items-center justify-center rounded-md bg-red-100 text-sm text-destructive">
                    {errorMessage}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="persistent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="persistent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="persistent"
                        className="text-sm font-normal"
                      >
                        Remember me
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !form.formState.isValid || Boolean(errorMessage) || loading
                }
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthLogin;
