import { motion } from "framer-motion";
import { getApiBase } from '../../lib/apiBase';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Mail, MapPin, Phone, Send, Linkedin, Github, Twitter } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

const Contact = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setSubmitStatus({ type: null, message: '' });
    try {
  const base = getApiBase();
  const res = await fetch(`${(base || '').replace(/\/$/, '')}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        const msg = json.error || json.message || 'Failed to send message. Please try again.';
        setSubmitStatus({ type: 'error', message: msg });
        return;
      }

      setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully. I will get back to you soon.' });
      reset();
    } catch (err) {
      setSubmitStatus({ type: 'error', message: 'Unable to send message. Check your internet connection and try again.' });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-emerald-400" />,
      title: 'Email Me',
      value: 'sangay@example.com',
      link: 'mailto:sangay@example.com',
    },
    {
      icon: <MapPin className="h-6 w-6 text-cyan-400" />,
      title: 'Location',
      value: 'Thimphu, Bhutan',
      link: 'https://maps.google.com/?q=Thimphu,Bhutan',
    },
    {
      icon: <Phone className="h-6 w-6 text-emerald-400" />,
      title: 'Call Me',
      value: '+975 77 88 99 00',
      link: 'tel:+97577889900',
    },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      url: 'https://linkedin.com',
      color: 'hover:bg-blue-600',
    },
    {
      name: 'GitHub',
      icon: <Github className="h-5 w-5" />,
      url: 'https://github.com',
      color: 'hover:bg-gray-700',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      url: 'https://twitter.com',
      color: 'hover:bg-sky-500',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-200">
            Get In <span className="text-emerald-400">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-6"></div>
          <p className="text-neutral-400 max-w-3xl mx-auto">
            Feel free to reach out to me for any questions or opportunities. I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-neutral-200">Contact Information</h3>
            <p className="text-neutral-400">
              I'm interested in freelance opportunities, especially ambitious or large projects. However, if you have other requests or questions, don't hesitate to contact me.
            </p>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-emerald-400/10 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-neutral-300 font-medium">{item.title}</h4>
                    <p className="text-neutral-400">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-neutral-300 font-medium mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-neutral-300 transition-colors duration-300 ${social.color}`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitStatus.type && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-3 rounded-md border ${
                    submitStatus.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-red-500/10 text-red-300 border-red-500/30'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder="John Doe"
                    className={`bg-zinc-800 border border-zinc-700 text-neutral-200 
                      focus:border-emerald-400 focus:ring-emerald-400/50 
                      appearance-none outline-none
                      ${errors.name ? 'border-red-500' : ''}`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    className={`bg-zinc-800 border border-zinc-700 text-neutral-200 
                      focus:border-emerald-400 focus:ring-emerald-400/50 
                      appearance-none outline-none
                      ${errors.email ? 'border-red-500' : ''}`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input
                  id="subject"
                  placeholder="How can I help you?"
                  className={`bg-zinc-800 border border-zinc-700 text-neutral-200 
                    focus:border-emerald-400 focus:ring-emerald-400/50 
                    appearance-none outline-none
                    ${errors.subject ? 'border-red-500' : ''}`}
                  {...register('subject')}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                )}
              </div>
              
              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Hi Sangay, I would like to talk about..."
                  className={`bg-zinc-800 border border-zinc-700 text-neutral-200 
                    focus:border-emerald-400 focus:ring-emerald-400/50 
                    appearance-none outline-none
                    ${errors.message ? 'border-red-500' : ''}`}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>
              
              {/* Submit */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-6 text-lg"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
