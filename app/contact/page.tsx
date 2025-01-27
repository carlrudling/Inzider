'use client';

const UserAgreement = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Contact
        </h1>

        <div className="bg-white shadow rounded-lg p-6 space-y-8">
          <section>
            <p className="text-md text-gray-800 mb-4">
              If you run into any issues, have feature suggestions or other
              questions please{' '}
              <a
                href="mailto:support.inzider@gmail.com"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                send an email to support.inzider@gmail.com
              </a>{' '}
              and we will respond as quickly as possible. Please keep in mind
              that this is a beta version and may include some bugs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserAgreement;
