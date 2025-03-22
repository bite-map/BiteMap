import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>Effective Date: [Date]</p>
      <p>
        Thank you for using our food truck tracker app. Your privacy is
        important to us, and we are committed to protecting the information you
        share with us. This Privacy Policy explains how we collect, use, and
        safeguard your information.
      </p>
      
      <h2 className="text-2xl font-semibold mt-4">1. Information We Collect</h2>
      <p>
        - <strong>Personal Information:</strong> When you create an account, we
        collect your name, email address, and any other information you
        provide.
      </p>
      <p>
        - <strong>Location Data:</strong> To help you find nearby food trucks,
        we collect your location with your permission.
      </p>
      <p>
        - <strong>Usage Data:</strong> We gather data about how you interact
        with our app to improve our services.
      </p>
      
      <h2 className="text-2xl font-semibold mt-4">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-8">
        <li>Provide location-based services and recommend nearby food trucks.</li>
        <li>Manage your account and personalize your experience.</li>
        <li>Improve and analyze our services.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4">3. Sharing Your Information</h2>
      <p>We do not sell your information. However, we may share it in the following cases:</p>
      <ul className="list-disc pl-8">
        <li>With your consent.</li>
        <li>With service providers to operate the app.</li>
        <li>When required by law.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4">4. Your Choices</h2>
      <p>
        You can manage your location permissions through your web browser
        settings. You may delete your account by contacting us.
      </p>

      <h2 className="text-2xl font-semibold mt-4">5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at [Contact Email].
      </p>
    </div>
  );
}