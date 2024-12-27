import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/lib/icon";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loading, Logo } from "@/components/custom";
import customAxios from "@/lib/customAxios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/context/store";
import { hideLoader, showLoader } from "@/context/services/loading";
import { login } from "@/context/services/auth";

const loginSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(5, {
		message: "Password must be at least 5 characters.",
	}),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: Partial<LoginFormValues> = {
	username: "",
	password: "",
};

const Login = () => {
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues,
	});
	const dispatch = useDispatch();
	const isLoading = useSelector((state: RootState) => state.loader.isLoading);
	const navigate: NavigateFunction = useNavigate();

	const onSubmit = async (data: LoginFormValues) => {
		try {
			dispatch(showLoader());
			const response = await customAxios.post("/auth/login", data);
			setTimeout(() => {
				dispatch(hideLoader());
			}, 1000);
			if (response.status === 200) {
				dispatch(
					login({
						user: {
							id: response.data.id,
							name: response.data.name,
							username: response.data.username,
							role: {
								id: response.data.rolePermission.id,
								name: response.data.rolePermission.name,
								permissions: response.data.rolePermission.permissions,
							},
						},
					}),
				);
				navigate("/");
				toast.success("Logged in successfully!");
			}
		} catch (error: any) {
			setTimeout(() => {
				dispatch(hideLoader());
			}, 1000);
			console.log(error);
			toast.error("An error occurred while logging in!");
		}
	};

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className="w-full flex min-h-screen flex-col justify-center py-12 px-6 lg:px-8">
					<Card className="sm:mx-auto sm:w-full sm:max-w-md">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl mb-2">
								<Logo />
							</CardTitle>
							<CardDescription className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-white">
								Sign in to your account
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-3"
								>
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input
														autoComplete="username"
														placeholder="Your username"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														autoComplete="current-password"
														type="password"
														placeholder="Your password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-x-2">
											<input
												type="checkbox"
												id="agreement"
												className="text-primary focus:ring-0 rounded-sm cursor-pointer"
											/>

											<label
												htmlFor="agreement"
												className="text-gray-600 cursor-pointer"
											>
												Remember me
											</label>
										</div>
										<a href="#" className="text-primary">
											Forgot password ?
										</a>
									</div>
									<Button className="w-full">Sign In</Button>
								</form>
							</Form>
						</CardContent>
						<CardFooter className="grid gap-4">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-6">
								<Button variant="outline">
									<Icons.gitHub className="mr-2 h-4 w-4" />
									Github
								</Button>
								<Button variant="outline">
									<Icons.google className="mr-2 h-4 w-4" />
									Google
								</Button>
							</div>
							<div className="text-center space-x-1">
								<p>
									Don’t have any account?{" "}
									<Link
										to="/auth/register"
										className="text-primary hover:text-gray-500 duration-100 ease-linear"
									>
										Sign Up
									</Link>
								</p>
							</div>
						</CardFooter>
					</Card>
				</div>
			)}
		</>
	);
};

export default Login;
