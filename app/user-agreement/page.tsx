'use client';

const UserAgreement = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          User Agreement
        </h1>

        <div className="bg-white shadow rounded-lg p-6 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600">
              Welcome to Inzider. By accessing or using our platform, you agree
              to be bound by these terms and conditions. This agreement is
              between you and Inzider, effective from the date of your first
              access to our platform. The terms and conditions may be updated
              from time to time, and you are responsible for reviewing them
              periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Definitions
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>"Platform" refers to the Inzider website and services.</p>
              <p>
                "Creator" refers to users who create and sell travel content.
              </p>
              <p>
                "User" refers to individuals who purchase and consume content.
              </p>
              <p>
                "Content" refers to trips, go-tos, and any related materials.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Account Registration
            </h2>
            <p className="text-gray-600">
              Users must provide accurate information during registration. You
              are responsible for maintaining the confidentiality of your
              account credentials and all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. Creator Terms
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>Creators must:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate and original content</li>
                <li>Hold necessary rights to shared content</li>
                <li>Maintain accurate pricing information</li>
                <li>Respond to user inquiries promptly</li>
                <li>Comply with platform guidelines</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              5. User Terms
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>Users agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use purchased content for personal use only</li>
                <li>Not redistribute or resell content</li>
                <li>Provide honest and fair reviews</li>
                <li>Make timely payments for purchases</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              6. Payments and Refunds
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>Payment terms:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All payments are processed through Stripe</li>
                <li>Platform fee of 20% applies to all transactions</li>
                <li>
                  Refunds may be issued upon agreement between creator and user,
                  Inzider will not be responsible for any refunds
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              7. Content Guidelines
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>All content must:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Be original or properly licensed</li>
                <li>Not violate any laws or regulations</li>
                <li>Not contain inappropriate or offensive material</li>
                <li>Be accurate and up-to-date</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              8. Privacy and Data
            </h2>
            <p className="text-gray-600">
              We collect and process personal data in accordance with our
              Privacy Policy. By using our platform, you consent to our data
              practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              9. Termination
            </h2>
            <p className="text-gray-600">
              We reserve the right to terminate or suspend accounts that violate
              these terms. Users may terminate their account at any time by
              contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              10. Changes to Agreement
            </h2>
            <p className="text-gray-600">
              We may modify this agreement at any time. Users will be notified
              of significant changes. Continued use of the platform constitutes
              acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              11. Contact
            </h2>
            <p className="text-gray-600">
              For questions about these terms, please contact us at
              support.inzider@gmail.com
            </p>
          </section>

          <div className="text-sm text-gray-500 mt-8 pt-4 border-t">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAgreement;
