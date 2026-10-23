import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, ShoppingBag, Settings, MapPin, KeyRound, ArrowRight, ArrowLeft, ClipboardList } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", email: "" });

    // Page load hote hi auth check aur user details fetch karna
    useEffect(() => {
        const token = localStorage.getItem("access");
        const storedUsername = localStorage.getItem("username");
        const storedEmail = localStorage.getItem("email");

        // Agar user logged in nahi hai, to use login page par bhej dein
        if (!token) {
            navigate("/login");
            return;
        }

        setUser({
            username: storedUsername || "User",
            email: storedEmail || "Not available",
        });
    }, [navigate]);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* TOP NAVIGATION BACK TO HOME BUTTON */}
                <div className="flex items-center justify-start">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/80 shadow-sm transition duration-150 ease-in-out group"
                    >
                        <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition duration-150" />
                        Back to Home
                    </Link>
                </div>

                {/* 1. HERO USER CARD */}
                <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                    {/* Large Initial Avatar */}
                    <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-md uppercase">
                        {user.username.charAt(0)}
                    </div>

                    {/* User Details */}
                    <div className="text-center sm:text-left space-y-1 flex-1">
                        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center justify-center sm:justify-start gap-2">
                            {user.username}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                Verified Account
                            </span>
                        </h1>
                        <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                            <Mail size={14} />
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* 2. TWO-COLUMN DASHBOARD LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">

                    {/* LEFT SIDEBAR: PROFILE INFO DETAILS */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm h-fit space-y-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Account Overview
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-muted rounded-xl text-muted-foreground">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Username</p>
                                    <p className="font-medium text-foreground">{user.username}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-muted rounded-xl text-muted-foreground">
                                    <Mail size={16} />
                                </div>
                                <div className="truncate">
                                    <p className="text-xs text-muted-foreground">Email Address</p>
                                    <p className="font-medium text-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT MAIN AREA: DASHBOARD ACTIONS */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Quick Actions Grid */}
                        <h3 className="text-lg font-bold text-foreground tracking-tight">
                            Dashboard Settings
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <Link
                                to="/profile/orders"
                                className="group bg-background border border-border hover:border-primary/50 rounded-2xl p-5 shadow-sm transition duration-200 cursor-pointer flex items-start gap-4"
                            >
                                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition duration-200">
                                    <ClipboardList size={20} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                        My Orders
                                        <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition" />
                                    </h4>
                                    <p className="text-xs text-muted-foreground">View order status and delivery details</p>
                                </div>
                            </Link>

                            {/* Card 1: Upload Our Products */}
                            <Link
                                to="/profile/upload-product"
                                className="group bg-background border border-border hover:border-primary/50 rounded-2xl p-5 shadow-sm transition duration-200 cursor-pointer flex items-start gap-4"
                            >
                                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition duration-200">
                                    <ShoppingBag size={20} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                        Upload Our Products
                                        <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition" />
                                    </h4>
                                    <p className="text-xs text-muted-foreground">List a new product item in the store</p>
                                </div>
                            </Link>


                            {/* Card 2: Shipping Address */}
                            <div className="group bg-background border border-border hover:border-primary/50 rounded-2xl p-5 shadow-sm transition duration-200 cursor-pointer flex items-start gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition duration-200">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                        Addresses
                                        <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition" />
                                    </h4>
                                    <p className="text-xs text-muted-foreground">Manage delivery locations</p>
                                </div>
                            </div>

                            {/* Card 3: Security */}
                            <div className="group bg-background border border-border hover:border-primary/50 rounded-2xl p-5 shadow-sm transition duration-200 cursor-pointer flex items-start gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition duration-200">
                                    <KeyRound size={20} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                        Password & Security
                                        <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition" />
                                    </h4>
                                    <p className="text-xs text-muted-foreground">Change password or 2FA</p>
                                </div>
                            </div>

                            {/* Card 4: Account Settings */}
                            <div className="group bg-background border border-border hover:border-primary/50 rounded-2xl p-5 shadow-sm transition duration-200 cursor-pointer flex items-start gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition duration-200">
                                    <Settings size={20} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                        Account Preferences
                                        <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition" />
                                    </h4>
                                    <p className="text-xs text-muted-foreground">Update profile details</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
