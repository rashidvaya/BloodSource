import { useState } from "react";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { SiFacebook, SiGoogle, SiApple } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";
import { PhoneInput } from "../components/PhoneInput";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mapping of Bangladesh divisions to their districts
const divisionDistricts: Record<string, string[]> = {
  Barisal: [
    "Barguna", "Barisal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"
  ],
  Chattogram: [
    "Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cumilla", "Cox's Bazar", "Feni", "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati"
  ],
  Dhaka: [
    "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail"
  ],
  Khulna: [
    "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"
  ],
  Mymensingh: [
    "Jamalpur", "Mymensingh", "Netrokona", "Sherpur"
  ],
  Rajshahi: [
    "Bogura", "Chapai Nawabganj", "Joypurhat", "Naogaon", "Natore", "Pabna", "Rajshahi", "Sirajganj"
  ],
  Rangpur: [
    "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"
  ],
  Sylhet: [
    "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"
  ]
};

// Mapping of districts to their main points (updated from CSV)
const districtMainPoints: Record<string, string[]> = {
  Barishal: [
    "Floating Guava Market", "Durga Sagar", "Oxford Mission Epiphany Cathedral Church", "Barishal Divisional Museum"
  ],
  Barguna: [
    "Bibichini Shahi Mosque", "Horin Ghata Eco Park", "Bihanga Island", "Bukabunia Liberation War Memorial"
  ],
  Bhola: [
    "Char Kukri Mukri Wildlife Sanctuary", "Manpura Island (sunrise/sunset views)", "Bir Sreshtho Mostafa Kamal Museum"
  ],
  Jhalokati: [
    "Bhimruli Floating Guava Market", "Dawud Shah's Khanqah and Mausoleum", "Sheikh Shah Khudgir's Mazar"
  ],
  Patuakhali: [
    "Kuakata Beach (sunrise/sunset views)", "Rakhain Palli (ethnic community villages)"
  ],
  Pirojpur: [
    "Floating Market in Kuriana (guava gardens)", "Momin Mosque", "8th Bangladesh-China Friendship Bridge", "Pirojpur River View Eco Park"
  ],
  Bandarban: [
    "Nilachal", "Nilgiri", "Shoilo Propat", "Sangu River", "Nafakhum Waterfall", "Meghla Tourist Spot", "Bandarban Golden Temple"
  ],
  Brahmanbaria: [
    "Titas Gas Field", "Akhaura Railway Junction", "Jamia Islamia Yunusia", "Haripur Barabari", "Hatirpul"
  ],
  Chandpur: [
    "Hilsa Fish Capital", "Meghna River Cruises", "Shahid Minar", "Amanat Shah Mazar", "Rupsa Zamindar Bari"
  ],
  Chattogram: [
    "Patenga Beach", "Foy's Lake", "Chattogram War Cemetery", "Shrine of Bayazid Bostami", "Ethnological Museum", "Chandanpura Mosque"
  ],
  Cumilla: [
    "Shalban Vihara (ancient Buddhist monastery)", "Mainamati War Cemetery", "Dharmasagar Lake", "Kandirpar Commercial Area"
  ],
  "Cox's Bazar": [
    "World's Longest Natural Sea Beach (Laboni, Sugandha, Kolatoli Points)", "Marine Drive", "Himchori Waterfall & Hill Track", "Dulahazra Safari Park", "St. Martin Island"
  ],
  Feni: [
    "Bijoy Singh Dighi", "Mubarak Shah Mosque", "Rajajhir Dighi", "Jamidar Mohammad Ali Chowdhury Mosque"
  ],
  Khagrachari: [
    "Sajek Valley", "Alutila Cave", "Risang Waterfall", "Panchari Shantipur Aranya Kutir (Buddha statue)", "New Zealand Road"
  ],
  Lakshmipur: [
    "Dalal Bazar Zamindar Bari", "Jinn Mosque", "Raipur Boro Masjid", "Meghna River"
  ],
  Noakhali: [
    "Nijhum Dwip (migratory birds)", "Gandhi Ashram Trust", "Musapur closure (Mini Cox's Bazar)", "Bozra Shahi Jame Masjid"
  ],
  Rangamati: [
    "Hanging Bridge (Jhulonto Bridge)", "Rajban Bihar Pagoda", "Shuvlong Waterfall", "Kaptai Lake (largest man-made lake)", "Chakma Rajbari"
  ],
  Dhaka: [
    "Ahsan Manzil (Pink Palace)", "Tara Masjid", "Lalbagh Fort", "Baitul Mukarram", "Bangladesh National Museum", "Hatirjheel"
  ],
  Faridpur: [
    "Shohid Smriti Memorial", "Padma River", "Madaripur Mosque", "Gopalpur Temple"
  ],
  Gazipur: [
    "Bhawal Rajbari", "Belai Bill", "Bhawal National Park", "Bangabandhu Safari Park", "Nuhash Polli", "numerous resorts"
  ],
  Gopalganj: [
    "Mausoleum of Bangabandhu Sheikh Mujibur Rahman", "Orakandi Thakur Bari", "Madhumati River", "Baor Lakes"
  ],
  Kishoreganj: [
    "Sholakia Eidgah Field (largest Eid Jamat)", "Egarosindur Fort", "Isha Khan's Jangalbari Fort", "Chandrabati Temple", "Haors"
  ],
  Madaripur: [
    "Shah Madar Dargah Sharif", "Padma River", "Arial Khan River", "Sree Sree Harichand Ashram", "Rajoir Zamindar Bari", "Jute Industry"
  ],
  Manikganj: [
    "Tewta Jomidar Bari", "Baliati Jomidar Bari", "Matta Moth", "Paturia Ferry Ghat", "Shahid Rafique Library & Memorial Museum"
  ],
  Munshiganj: [
    "Idrakpur Fort", "Padma Bridge & Mawa Point", "Bikrampur Museum", "Jalalpur Zamindar Bari", "Meghna River"
  ],
  Narayanganj: [
    "Panam Nagar (ancient capital)", "Bangladesh Folk Art & Crafts Foundation", "Kadam Rasul Darbar Sharif", "Zinda Park", "Hajiganj Fort", "Taj Mahal of Bengal"
  ],
  Narsingdi: [
    "Dream Holiday Park", "Shitalakshya River", "Danga Jomidar Bari", "International Trade Fair"
  ],
  Rajbari: [
    "Chandana River", "Kazi Hedayet Hossain Stadium", "Bahadurpur Hena Park", "UK BEACH"
  ],
  Shariatpur: [
    "Padma Multipurpose Bridge", "Modern Fantasy Kingdom", "Birshrestha Lance Nayek Munshi Abdur Rouf Stadium"
  ],
  Tangail: [
    "201 Dome Mosque (most domed in world)", "Mohera Zamindar Bari", "Atia Mosque", "Jamuna River"
  ],
  Bagerhat: [
    "Sixty Dome Mosque (UNESCO World Heritage Site)"
  ],
  Chuadanga: [
    "Alamdanga Railway Station", "Carew and Company Bangladesh", "Datt-Nagar Agricultural Firm", "Dhopkhali Shahi Mosque"
  ],
  Jessore: [
    "Michael Madhusudan Dutta Memorial", "Benapole Land Port", "Monihar Cinema Hall", "Chanchra Shiva Temple"
  ],
  Jhenaidah: [
    "Naldanga Rajbari", "Shailkupa Shahi Mosque", "Pagla Kanai Memorial Complex", "Jor Bangla Mandir"
  ],
  Khulna: [
    "Gateway to the Sundarbans (World's largest mangrove forest)"
  ],
  Kushtia: [
    "Shilaidaha Kuthibari (Rabindranath Tagore's dwelling)", "Shrine of Lalon Fakir", "Islamic University"
  ],
  Magura: [
    "Magura Bus Terminal Jame Masjid", "Bir Muktijoddha Asaduzzaman Stadium", "Magura Kali Temple", "Nabaganga River"
  ],
  Meherpur: [
    "Mujibnagar Complex Museum (birthplace of provisional government)", "Amjhupi Neelkuthi", "Siddheshwari Kali Mandir"
  ],
  Narail: [
    "S M Sultan Memorial Gallery", "Bishreshtho Nur Mohammad Stadium", "Niribili Picnic Spot"
  ],
  Satkhira: [
    "Sonabaria Moth Bari Temple", "Annapurna Temple", "Jeshoreswari Kali Mandir", "Chaikghariya Twin Shiva Temple"
  ],
  Jamalpur: [
    "Jamalpur Gymkhana", "Jamalpur Waterfall", "Rail Niwas", "Old Brahmaputra River", "Bahadurabad Ferry Ghat (historical)"
  ],
  Mymensingh: [
    "Bishyanath Temple", "Boro Masjid", "Mymensingh Museum", "Lohar Kutir", "Soshi Lodge"
  ],
  Netrakona: [
    "Birishiri Cultural Academy (ethnic culture)", "Someshwari River", "China Matir Pahar (Kaolin Hills)", "Dingapota Haor (wetland)", "Uchitpur Haor (Mini Cox's Bazar)"
  ],
  Sherpur: [
    "Madhutila Eco Park", "Ghagra Khan Bari Jami Mosque", "Mysaheba Jame Masjid", "Brahmaputra River"
  ],
  Bogra: [
    "Mahasthangarh (ancient city remnants)", "Panch Peer Mazar", "Gokul Medh", "Kherua Mosque"
  ],
  "Chapai Nawabganj": [
    "Choto Sona Mosque", "Mughal Tahakhana", "Darasbari Mosque", "Khania Dighi Mosque", "Shah Niamatullah's Tomb"
  ],
  Joypurhat: [
    "Joypurhat Sugar Mills", "Cement Factory", "Nandail Lake", "Ashranga Lake", "Pachbibir Mazar"
  ],
  Naogaon: [
    "Somapura Mahavihara (UNESCO site)", "Kusumba Mosque", "Rabindranath Tagore's Patisar Kachari Bari", "Dubalhati Palace"
  ],
  Natore: [
    "Uttara Gonobhobon", "Puthia Rajbari", "Patul Mini Cox's Bazar", "Baral River"
  ],
  Pabna: [
    "Jorbangla Temple", "Paksey Hardinge Bridge", "House of Suchitra Sen", "Anukul Chandra Satsang Ashram"
  ],
  Rajshahi: [
    "Puthia Temple Complex", "Varendra Research Museum", "Bagha Mosque", "Padma River", "Shaheb Bazar"
  ],
  Sirajganj: [
    "Bangabandhu Bridge (Jamuna Bridge)", "Rabindranath Tagore's Kacharibari", "Hatikumrul Navaratna Temple", "Loom Crafting Industry"
  ],
  Dinajpur: [
    "Kantojew Mondir", "Ramsagor", "Rajbari", "Noyabad Mosque", "Horinathpur Fortcity"
  ],
  Gaibandha: [
    "Rajbirat Prasad", "Naldanga Zamidar Bari", "Bamondanga Zamidar Bari", "Shah Sultan Gazi's Mosque", "Jamuna River"
  ],
  Kurigram: [
    "Jamuna River", "Dharla Bridge", "Mekurtari Shahi Mosque", "North Bengal Museum", "Bir Protik Taramon Bibi's house"
  ],
  Lalmonirhat: [
    "Teesta Barrage", "Kakina Jomidar Bari", "Tushbhandar Jagat Bari", "Mogolhat Port 0 Point", "Lalmonirhat Railway Station"
  ],
  Nilphamari: [
    "Nilsagar", "Chini Masjid", "Tista Barrage", "Uttara Export Processing Zone", "Saidpur Railway Workshop"
  ],
  Panchagarh: [
    "Tetulia Dak Bungalow", "Debiganj Karatoya Bridge", "Kazi and Kazi Tea Estate", "Banglabandha Point (Zero Point)", "Panchagarh Rocks Museum"
  ],
  Rangpur: [
    "Tajhat Palace", "Rangpur Zoo", "Vinnya Jagat Amusement Park", "Begum Rokeya Memorial", "Chiklee Water Park"
  ],
  Thakurgaon: [
    "Balia Mosque", "Biggest mango tree of Asia", "Tangon River", "Ramrai Dighi", "Haripur Rajbari"
  ],
  Habiganj: [
    "Tea Museum", "Bodhavumi 71", "Lawachara National Park", "Ratargul Swamp Forest"
  ],
  Moulvibazar: [
    "Hum Hum Falls", "Sreemangal Tea Gardens", "Lawachara National Park", "Madhobpur Lake", "Prithimpassa Jame Masjid"
  ],
  Sunamganj: [
    "Tanguar Haor", "Niladri Limestone Lake", "Shimul Bagan", "Jadukata River", "Barek Tila", "Hason Raja Museum"
  ],
  Sylhet: [
    "Shrine of Hazrat Shah Jalal", "Jaflong", "Ratargul Swamp Forest", "Bisnakandi", "Hazrat Shah Paran Mazar Sharif", "Madhabkunda Waterfall"
  ]
};

const step1Schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  invitation: z.string()
    .min(6, "Invitation code must be 6 digits")
    .max(6, "Invitation code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Invitation code must be exactly 6 digits"),
});

const step2Schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  verify: z.string().min(6, "Please verify your password"),
}).refine((data) => data.password === data.verify, {
  message: "Passwords do not match",
  path: ["verify"],
});

const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  invitation: z.string()
    .min(6, "Invitation code must be 6 digits")
    .max(6, "Invitation code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Invitation code must be exactly 6 digits"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  mainPoint: z.string().min(1, "Main Point is required"),
  bloodGroup: z.enum([
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ], { required_error: "Blood group is required" }),
  gender: z.enum(["Men", "Women", "Transgender"], { required_error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  idType: z.enum(["Birth Certificate", "NID"], { required_error: "ID Type is required" }),
  idNumber: z.string().min(1, "ID Number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  verify: z.string().min(6, "Please verify your password"),
}).refine((data) => data.password === data.verify, {
  message: "Passwords do not match",
  path: ["verify"],
}).superRefine((data, ctx) => {
  if (data.idType === "NID") {
    if (!/^\d+$/.test(data.idNumber)) {
      ctx.addIssue({
        path: ["idNumber"],
        code: z.ZodIssueCode.custom,
        message: "NID must be numeric (numbers only)",
      });
    }
    // Optionally add length check for NID here
  } else if (data.idType === "Birth Certificate") {
    if (!/^\d{17}$/.test(data.idNumber)) {
      ctx.addIssue({
        path: ["idNumber"],
        code: z.ZodIssueCode.custom,
        message: "Birth Certificate must be numeric and exactly 17 digits",
      });
    }
  }
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [, navigate] = useLocation();
  const { signup, isLoading } = useAuth();
  const [invitationStatus, setInvitationStatus] = useState<null | { valid: boolean; message: string }>(null);
  const [verifying, setVerifying] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<null | { valid: boolean; message: string }>(null);
  const [verifyingUsername, setVerifyingUsername] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<SignupForm>({
    resolver: zodResolver(step === 1 ? step1Schema : signupSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      verify: "",
      invitation: "",
      division: "",
      district: "",
      mainPoint: "",
      bloodGroup: undefined,
      gender: undefined,
      dateOfBirth: "",
      idType: undefined,
      idNumber: "",
    },
  });

  // Watch idType for dynamic placeholder
  const watchedIdType = useWatch({ control: form.control, name: 'idType' });

  // Watch password and verify fields for instant mismatch error
  const watchedPassword = useWatch({ control: form.control, name: 'password' });
  const watchedVerify = useWatch({ control: form.control, name: 'verify' });

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    if (step === 1) {
      setStep(2);
    } else {
      const result = await signup(data);
      if (result.success) {
        // User will be redirected automatically by the auth hook
      }
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`${provider} signup clicked`);
  };

  const handleVerifyInvitation = async (code: string) => {
    setVerifying(true);
    setInvitationStatus(null);
    try {
      const response = await fetch("/api/verify-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setInvitationStatus(data);
    } catch (e) {
      setInvitationStatus({ valid: false, message: "Verification failed" });
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus(null);
      return;
    }
    setVerifyingUsername(true);
    setUsernameStatus(null);
    try {
      const response = await fetch("/api/verify-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      setUsernameStatus(data);
    } catch (e) {
      setUsernameStatus({ valid: false, message: "Verification failed" });
    } finally {
      setVerifyingUsername(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('username', e.target.value);
    setUsernameStatus(null);
    if (e.target.value.length >= 3) {
      handleVerifyUsername(e.target.value);
    }
  };

  const handleInvitationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input and limit to 6 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    form.setValue('invitation', value);
    setInvitationStatus(null);
  };

  // Watch phone field and show OTP input if 10 digits
  const phoneValue = form.watch("phone");
  React.useEffect(() => {
    if (phoneValue && phoneValue.length === 10) {
      setShowOtp(true);
    } else {
      setShowOtp(false);
      setOtp("");
    }
  }, [phoneValue]);

  React.useEffect(() => {
    if (!showOtp) setOtpVerified(false);
  }, [showOtp]);

  // Simulate OTP verification (replace with real API call)
  const verifyOtp = (code: string) => {
    // Simulate async verification (replace with fetch to backend)
    if (code.length === 4) {
      setTimeout(() => {
        setOtpVerified(true); // Simulate success
      }, 500); // Simulate network delay
    } else {
      setOtpVerified(false);
    }
  };

  // Auto-clear district when division changes
  React.useEffect(() => {
    form.setValue('district', '');
  }, [form.watch('division')]);

  // Add after the effect that resets district when division changes
  React.useEffect(() => {
    form.setValue('mainPoint', '');
  }, [form.watch('district')]);

  return (
    <div className="min-h-screen flex flex-col bg-facebook-gray animate-in fade-in duration-500">
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-lg animate-in slide-in-from-bottom-4 duration-700">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <CardTitle className="text-2xl font-bold text-[#d91c1f]">
                  New member registration 🤩
                </CardTitle>
              </div>
              <p className="text-facebook-muted text-sm">
                You are on step {step} out of 2
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {step === 1 && (
                    <>
                      {/* Invitation Code Input */}
                      <FormField
                        control={form.control}
                        name="invitation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Invitation code</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Invitation code"
                                  className="pl-4 pr-20 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-sm"
                                  {...field}
                                  disabled={false}
                                  autoComplete="off"
                                  id="invitation"
                                  name="invitation"
                                  maxLength={6}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  onChange={handleInvitationChange}
                                />
                                <button
                                  type="button"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-facebook-blue text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition"
                                  onClick={() => handleVerifyInvitation(field.value)}
                                  disabled={verifying || !field.value}
                                >
                                  {verifying ? <Loader2 className="h-3 w-3 animate-spin" /> : "Verify"}
                                </button>
                              </div>
                            </FormControl>
                            {invitationStatus && (
                              <div className={`text-xs mt-1 ${invitationStatus.valid ? 'text-green-600' : 'text-red-600'}`}>
                                {invitationStatus.message}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Full Name */}
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Full name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                                <Input
                                  placeholder="Full name"
                                  className="pl-10 pr-4 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-sm"
                                  {...field}
                                  disabled={!invitationStatus?.valid}
                                  autoComplete="name"
                                  id="fullName"
                                  name="fullName"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Username Field */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Username"
                                  className="pl-4 pr-20 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-sm"
                                  {...field}
                                  onChange={handleUsernameChange}
                                  onBlur={() => handleVerifyUsername(form.getValues('username'))}
                                  disabled={!invitationStatus?.valid}
                                  autoComplete="username"
                                  id="username"
                                  name="username"
                                />
                                {verifyingUsername && (
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-facebook-muted">...</span>
                                )}
                              </div>
                            </FormControl>
                            {usernameStatus && (
                              <div className={`text-xs mt-1 ${usernameStatus.valid ? 'text-green-600' : 'text-red-600'}`}>
                                {usernameStatus.message}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email Input */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Email address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                                <Input
                                  placeholder="Email address"
                                  className="pl-10 pr-4 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent"
                                  {...field}
                                  disabled={!invitationStatus?.valid || !usernameStatus?.valid}
                                  autoComplete="email"
                                  id="email"
                                  name="email"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Phone Number Input */}
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Phone number</FormLabel>
                            <FormControl>
                              <PhoneInput
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!invitationStatus?.valid || !usernameStatus?.valid}
                                autoComplete="tel"
                                id="phone"
                                name="phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* OTP Input (shows after phone is filled) */}
                      {showOtp && (
                        <div className="relative mt-2">
                          <input
                            type="text"
                            maxLength={4}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-full h-10 rounded-md border border-facebook-border bg-facebook-gray px-4 pr-4 text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-facebook-blue focus:border-transparent outline-none transition"
                            placeholder="Enter 4-digit code"
                            value={otp}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                              setOtp(val);
                              setOtpVerified(false);
                              if (val.length === 4) verifyOtp(val);
                            }}
                            disabled={otpVerified}
                            autoComplete="one-time-code"
                            id="otp"
                            name="otp"
                          />
                          {otpVerified && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-semibold text-sm">Verified</span>
                          )}
                        </div>
                      )}

                      {/* Next Button */}
                      <Button
                        type="submit"
                        disabled={isLoading || !invitationStatus?.valid || !usernameStatus?.valid || (showOtp && !otpVerified)}
                        className="w-full bg-facebook-success hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:opacity-50"
                      >
                        {step === 1 ? "Next" : (isLoading ? "Creating account..." : "Register")}
                      </Button>

                      {/* Divider */}
                      <div className="flex items-center my-6">
                        <Separator className="flex-1" />
                        <span className="px-4 text-facebook-muted text-sm">or</span>
                        <Separator className="flex-1" />
                      </div>

                      {/* Social Signup Buttons */}
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={() => handleSocialSignup("Facebook")}
                          className="w-full bg-facebook-blue hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                        >
                          <SiFacebook />
                          Sign up with Facebook
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleSocialSignup("Google")}
                          className="w-full bg-white border border-facebook-border hover:bg-gray-50 text-facebook-text font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                        >
                          <SiGoogle className="text-red-500" />
                          Sign up with Google
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleSocialSignup("Apple")}
                          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                        >
                          <SiApple />
                          Sign up with Apple
                        </Button>
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      {/* Division and District Dropdowns Side by Side */}
                      <div className="flex gap-2 mb-4">
                        <div className="w-1/2">
                          <FormField
                            control={form.control}
                            name="division"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">Division</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select Division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Barisal">Barisal</SelectItem>
                                      <SelectItem value="Chattogram">Chattogram</SelectItem>
                                      <SelectItem value="Dhaka">Dhaka</SelectItem>
                                      <SelectItem value="Khulna">Khulna</SelectItem>
                                      <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                                      <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                                      <SelectItem value="Rangpur">Rangpur</SelectItem>
                                      <SelectItem value="Sylhet">Sylhet</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-1/2">
                          <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">District</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select District" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {divisionDistricts[form.getValues('division')]?.map((district) => (
                                        <SelectItem key={district} value={district}>{district}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      {/* Main Point Dropdown (shows after district is selected) */}
                      {form.getValues('district') && (
                        <div className="mb-4">
                          <FormField
                            control={form.control}
                            name="mainPoint"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">Living Around</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Living Around" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(districtMainPoints[form.getValues('district')] || ["Other"]).map((point) => (
                                        <SelectItem key={point} value={point}>{point}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      {/* Blood Group, Gender, and Date of Birth in one row */}
                      <div className="flex gap-2 mb-4">
                        <div className="w-1/3">
                          <FormField
                            control={form.control}
                            name="bloodGroup"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">Blood Group</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="A+">A+</SelectItem>
                                      <SelectItem value="A-">A-</SelectItem>
                                      <SelectItem value="B+">B+</SelectItem>
                                      <SelectItem value="B-">B-</SelectItem>
                                      <SelectItem value="AB+">AB+</SelectItem>
                                      <SelectItem value="AB-">AB-</SelectItem>
                                      <SelectItem value="O+">O+</SelectItem>
                                      <SelectItem value="O-">O-</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-1/3">
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">Gender</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Men">Men</SelectItem>
                                      <SelectItem value="Women">Women</SelectItem>
                                      <SelectItem value="Transgender">Transgender</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-1/3">
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => {
                              const inputRef = React.useRef<HTMLInputElement>(null);
                              const hiddenDateRef = React.useRef<HTMLInputElement>(null);
                              // Calculate min and max dates for age 16-60
                              const today = new Date();
                              const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
                                .toISOString()
                                .split('T')[0];
                              const minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate())
                                .toISOString()
                                .split('T')[0];
                              React.useEffect(() => {
                                if (field.value && inputRef.current) {
                                  inputRef.current.value = field.value;
                                }
                              }, [field.value]);
                              return (
                                <FormItem>
                                  <FormLabel className="sr-only">Date of Birth</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type="text"
                                        placeholder="Date of Birth"
                                        className="w-full py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent cursor-pointer"
                                        value={field.value ? new Date(field.value).toLocaleDateString() : ""}
                                        readOnly
                                        ref={inputRef}
                                        onClick={() => hiddenDateRef.current && hiddenDateRef.current.showPicker && hiddenDateRef.current.showPicker()}
                                        tabIndex={0}
                                        autoComplete="bday"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                      />
                                      <input
                                        type="date"
                                        ref={hiddenDateRef}
                                        value={field.value || ""}
                                        onChange={e => field.onChange(e.target.value)}
                                        style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0, pointerEvents: "none" }}
                                        tabIndex={-1}
                                        min={minDate}
                                        max={maxDate}
                                        autoComplete="bday"
                                        id="dateOfBirth-hidden"
                                        name="dateOfBirth"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                      </div>
                      {/* ID Type Select - moved here before password */}
                      <div className="flex gap-2 mb-4 flex-nowrap items-center">
                        <div className="flex-1 min-w-[140px] max-w-[220px]">
                          <FormField
                            control={form.control}
                            name="idType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">ID Type</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger
                                      className="w-full text-left bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent px-4 py-3 text-base placeholder:text-gray-400 h-[48px]"
                                      style={{ minWidth: '140px', fontSize: '1rem' }}
                                    >
                                      <SelectValue placeholder="Id Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Birth Certificate">Birth Certificate</SelectItem>
                                      <SelectItem value="NID">NID</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-[180px] max-w-[350px]">
                          <FormField
                            control={form.control}
                            name="idNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">ID Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={watchedIdType === 'Birth Certificate' ? '17 Digit Birth Certificate No' : 'Enter Nid No'}
                                    className="w-full text-left bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent px-4 py-3 text-base placeholder:text-gray-400 h-[48px]"
                                    style={{ textAlign: 'left', minWidth: '180px', fontSize: '1rem' }}
                                    {...field}
                                    autoComplete="off"
                                    id="idNumber"
                                    name="idNumber"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      {/* Password Input */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  className="pl-10 pr-14 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent"
                                  {...field}
                                  disabled={!invitationStatus?.valid || !usernameStatus?.valid}
                                  autoComplete="new-password"
                                  id="password"
                                  name="password"
                                />
                                <button
                                  type="button"
                                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-facebook-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={!invitationStatus?.valid || !usernameStatus?.valid}
                                  aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Verify Password Input */}
                      <FormField
                        control={form.control}
                        name="verify"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Verify password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                                <Input
                                  type={showVerifyPassword ? "text" : "password"}
                                  placeholder="Verify password"
                                  className="pl-10 pr-14 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent"
                                  {...field}
                                  disabled={!invitationStatus?.valid || !usernameStatus?.valid}
                                  autoComplete="new-password"
                                  id="verify"
                                  name="verify"
                                />
                                <button
                                  type="button"
                                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-facebook-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
                                  onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                                  disabled={!invitationStatus?.valid || !usernameStatus?.valid}
                                  aria-label={showVerifyPassword ? "Hide verification password" : "Show verification password"}
                                >
                                  {showVerifyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormControl>
                            {/* Show instant password mismatch error */}
                            {watchedPassword && watchedVerify && watchedPassword !== watchedVerify && (
                              <div className="text-xs mt-1 text-red-600">Passwords do not match</div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Terms (before buttons) */}
                      <p className="text-xs text-facebook-muted text-center leading-relaxed mb-2">
                        By clicking Register, you agree to our{" "}
                        <a href="#" className="text-facebook-blue hover:underline">
                          Terms
                        </a>
                        ,{" "}
                        <a href="#" className="text-facebook-blue hover:underline">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-facebook-blue hover:underline">
                          Cookies Policy
                        </a>
                        .
                      </p>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => setStep(1)}
                          className="w-1/2 bg-facebook-gray border border-facebook-border text-facebook-text font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-1/2 bg-facebook-success hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:opacity-50"
                        >
                          {isLoading ? "Creating account..." : "Register"}
                        </Button>
                      </div>
                    </>
                  )}
                  {/* Back to Login */}
                  <div className="text-center border-t border-facebook-border pt-4 mt-6">
                    <p className="text-facebook-muted text-sm">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-facebook-blue hover:underline font-medium"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}