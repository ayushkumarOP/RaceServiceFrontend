import { useState } from "react";
import type { FormEvent } from "react";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const INITIAL_VALUES: FormValues = { name: "", email: "", message: "" };
const SUPPORT_EMAIL = "baladitya.bhaskar@gmail.com";
const SUPPORT_PHONE = "+919289539277";

export default function SupportSection() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailIsValid = /^\S+@\S+\.\S+$/.test(values.email);

    if (!values.name.trim() || !emailIsValid || values.message.trim().length < 10) {
      setSuccess("");
      setError("Please add your name, a valid email address, and a message of at least 10 characters.");
      return;
    }

    setError("");
    setSuccess("Thanks - your message is ready to send. Connect a support inbox to deliver it to the team.");
    setValues(INITIAL_VALUES);
  };

  return (
    <section id="support" className="scroll-mt-16 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-race-accent">Support</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Get help from the pit wall.</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/65">
            Send your question, feedback, or issue and the team will route it to the right place.
          </p>
          <dl className="mt-7 grid gap-4 text-sm">
            <div>
              <dt className="font-semibold text-white/55">Email</dt>
              <dd className="mt-1">
                <a className="text-white hover:text-race-accent hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white/55">Phone</dt>
              <dd className="mt-1">
                <a className="text-white hover:text-race-accent hover:underline" href={`tel:${SUPPORT_PHONE}`}>
                  +91 92895 39277
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} noValidate className="border border-white/10 bg-[#12121b] p-5 shadow-2xl shadow-black/30 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-white/85">
              Name
              <input value={values.name} onChange={(event) => updateValue("name", event.target.value)} autoComplete="name" className="border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-race-accent" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-white/85">
              Email
              <input type="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} autoComplete="email" className="border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-race-accent" />
            </label>
          </div>
          <label className="mt-4 grid gap-2 text-sm font-medium text-white/85">
            How can we help?
            <textarea value={values.message} onChange={(event) => updateValue("message", event.target.value)} rows={5} className="resize-y border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-race-accent" />
          </label>
          <div className="mt-4 min-h-6" aria-live="polite">
            {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
            {success && <p className="text-sm text-emerald-300" role="status">{success}</p>}
          </div>
          <button type="submit" className="mt-3 inline-flex rounded-full bg-race-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
