import React, { useState } from "react";

const roles = [
  "Admin",
  "Moderator",
  "Volunteer",
  "Other"
];

const StaffRegistrationPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    verifyCode: "",
    username: "",
    extension: ".ad",
    name: "",
    email: "",
    phone: "",
    password: "",
    verifyPassword: "",
    role: roles[0]
  });
  const [codeTouched, setCodeTouched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeStatus, setCodeStatus] = useState<null | boolean>(null);
  const [usernameStatus, setUsernameStatus] = useState<null | boolean>(null);
  const [usernameVerifying, setUsernameVerifying] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "verifyCode") {
      setCodeTouched(true);
      setCodeStatus(null);
      const code = value;
      if (/^\d{4}$/.test(code)) {
        setVerifying(true);
        try {
          const res = await fetch("/api/verify-staff-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const data = await res.json();
          setCodeStatus(data.valid);
        } catch {
          setCodeStatus(false);
        } finally {
          setVerifying(false);
        }
      } else {
        setCodeStatus(null);
      }
    }
    // Username auto verify
    if ((name === "username" || name === "extension") && (name === "username" ? value.length : form.username.length) >= 3) {
      const usernameToCheck = name === "username" ? value + form.extension : form.username + value;
      setUsernameVerifying(true);
      setUsernameStatus(null);
      try {
        const res = await fetch("/api/verify-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: usernameToCheck }),
        });
        const data = await res.json();
        setUsernameStatus(data.valid);
      } catch {
        setUsernameStatus(false);
      } finally {
        setUsernameVerifying(false);
      }
    } else if (name === "username" || name === "extension") {
      setUsernameStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Compose the full username
    const fullUsername = form.username + form.extension;
    // Map frontend role to backend role
    const roleMap: Record<string, string> = {
      Admin: "super_admin",
      Moderator: "regional_moderator",
      Volunteer: "volunteer_coordinator",
      Other: "user",
    };
    const backendRole = roleMap[form.role] || "user";
    try {
      const res = await fetch("/api/register-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verifyCode: form.verifyCode,
          username: fullUsername,
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: backendRole,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        // Show all error details if present
        if (data.errors) {
          alert(
            (data.message || "Registration failed.") +
            "\n" +
            data.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join('\n')
          );
        } else {
          alert(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  const passwordsMatch = form.password === form.verifyPassword && form.password.length > 0;

  return (
    <div className="flex-1 flex flex-col bg-facebook-gray min-h-screen">
      <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="w-full max-w-md lg:max-w-2xl mx-auto h-full">
          <div className="bg-white/80 rounded-xl shadow p-6 sm:p-8 h-full min-h-[420px] flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-[#d91c1f] mb-2 text-center">New Staff Registration</h1>
            {!submitted && (
              <p className="text-facebook-muted text-center mb-6">Fill out the form below to register as a staff member.</p>
            )}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code Verify */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verify Code</label>
                  <input
                    type="text"
                    name="verifyCode"
                    value={form.verifyCode}
                    onChange={handleChange}
                    onBlur={() => setCodeTouched(true)}
                    required
                    maxLength={4}
                    className="w-full border border-facebook-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                    placeholder="Enter 4-digit code"
                  />
                  {verifying && form.verifyCode.length === 4 ? (
                    <div className="text-blue-600 text-xs mt-1">Verifying...</div>
                  ) : form.verifyCode.length === 4 && codeStatus === true ? (
                    <div className="text-green-600 text-xs mt-1">Verified</div>
                  ) : form.verifyCode.length === 4 && codeStatus === false ? (
                    <div className="text-red-600 text-xs mt-1">Invalid code</div>
                  ) : null}
                </div>
                {/* Username + Extension Selector */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="flex-1 border border-facebook-border rounded-none rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                      placeholder="Enter username"
                      disabled={codeStatus !== true}
                    />
                    <select
                      name="extension"
                      value={form.extension}
                      onChange={handleChange}
                      className="border border-facebook-border rounded-none rounded-r w-20 px-2 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                      disabled={codeStatus !== true}
                    >
                      <option value=".ad">.ad</option>
                      <option value=".mod">.mod</option>
                      <option value=".vol">.vol</option>
                    </select>
                  </div>
                  {form.username.length > 0 && form.username.length < 3 && (
                    <div className="text-red-600 text-xs mt-1">Username must be at least 3 characters</div>
                  )}
                  {form.username.length >= 3 && (usernameVerifying ? (
                    <div className="text-blue-600 text-xs mt-1">Checking username availability...</div>
                  ) : usernameStatus === true ? (
                    <div className="text-green-600 text-xs mt-1">Username is available</div>
                  ) : usernameStatus === false ? (
                    <div className="text-red-600 text-xs mt-1">Username is not available</div>
                  ) : null)}
                </div>
                {/* Full Name */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-facebook-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                    placeholder="Enter your full name"
                    disabled={codeStatus !== true}
                  />
                </div>
                {/* Email */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-facebook-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                    placeholder="Please Use Fresh Email"
                    disabled={codeStatus !== true}
                  />
                </div>
                {/* Phone */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-facebook-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                    placeholder="Enter your phone number"
                    disabled={codeStatus !== true}
                  />
                </div>
                {/* Password */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-facebook-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                    placeholder="Enter password"
                    disabled={codeStatus !== true}
                  />
                </div>
                {/* Verify Password */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verify Password</label>
                  <input
                    type="password"
                    name="verifyPassword"
                    value={form.verifyPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-facebook-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                    placeholder="Re-enter password"
                    disabled={codeStatus !== true}
                  />
                  {form.verifyPassword.length > 0 && !passwordsMatch && (
                    <div className="text-red-600 text-xs mt-1">Passwords do not match</div>
                  )}
                  {form.verifyPassword.length > 0 && passwordsMatch && (
                    <div className="text-green-600 text-xs mt-1">Passwords match</div>
                  )}
                </div>
                {/* Role (hidden, for now) */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border border-facebook-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-facebook-blue"
                    disabled={codeStatus !== true}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div> */}
                <button
                  type="submit"
                  className="w-full lg:col-span-2 px-4 py-2 bg-[#d91c1f] text-white rounded hover:bg-red-700 font-semibold mt-2"
                  disabled={codeStatus !== true || usernameStatus !== true || !passwordsMatch}
                >
                  Register
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-green-800 mt-12 p-6 bg-green-50 rounded-xl shadow-lg max-w-xl mx-auto animate-in fade-in duration-700">
                <div className="text-3xl font-extrabold mb-2 text-[#d91c1f]">🎉 Welcome to BloodSource!</div>
                <div className="text-lg font-semibold mb-4">Thank you for registering and becoming a part of the BloodSource team.</div>
                <div className="text-base mb-6 text-gray-700">We're excited to have you on board!<br/>You can now log in to your account and start exploring your dashboard.</div>
                <a href="http://localhost:5000/" className="inline-block px-6 py-2 bg-[#d91c1f] text-white rounded-lg font-bold text-base shadow hover:bg-red-700 transition mb-6">Log In to Your Account</a>
                <div className="text-sm text-gray-600 mb-2">If you need any help, feel free to reach out — we’re here for you.</div>
                <div className="text-lg font-semibold text-red-600">Let’s make a difference together. <span className="align-middle">❤️💉</span></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffRegistrationPage; 