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
    name: "",
    email: "",
    phone: "",
    role: roles[0]
  });
  const [codeTouched, setCodeTouched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeStatus, setCodeStatus] = useState<null | boolean>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "verifyCode") {
      setCodeTouched(true);
      setCodeStatus(null);
      const code = e.target.value;
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend
  };

  return (
    <div className="flex-1 flex flex-col bg-facebook-gray min-h-screen">
      <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="w-full max-w-md mx-auto h-full">
          <div className="bg-white/80 rounded-xl shadow p-6 sm:p-8 h-full min-h-[420px] flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-[#d91c1f] mb-2 text-center">New Staff Registration</h1>
            {!submitted && (
              <p className="text-facebook-muted text-center mb-6">Fill out the form below to register as a staff member.</p>
            )}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#d91c1f] text-white rounded hover:bg-red-700 font-semibold mt-2"
                  disabled={codeStatus !== true}
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