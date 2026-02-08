/**
 * GET /accessibility
 * Accessibility Statement page for SNIVEL platform
 * Documents WCAG 2.1 AA conformance commitment
 */

import { define } from "@/utils.ts";
import Logo from "@/components/Logo.tsx";

export default define.page(function Accessibility() {
  return (
    <div class="min-h-screen bg-white">
      {/* Navigation */}
      <nav class="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <div class="flex items-center">
              <a href="/" class="flex items-center gap-2">
                <Logo size="md" class="text-gray-900" />
              </a>
            </div>
            <div class="flex items-center gap-4">
              <a href="/pricing" class="text-gray-700 hover:text-gray-900 font-medium">
                Pricing
              </a>
              <a href="/login" class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 hover:border-gray-400 rounded-lg">
                Login
              </a>
              <a href="/signup" class="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div id="main-content" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="mb-8">
          <span class="inline-block bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            Accessibility
          </span>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Accessibility Statement
        </h1>
        <p class="text-gray-600 mb-12">Last updated: February 7, 2026</p>

        <div class="prose prose-gray max-w-none">
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              ODOV LLC ("SNIVEL," "we," "us") is committed to ensuring digital accessibility for
              people with disabilities. We continually improve the user experience for everyone
              and apply the relevant accessibility standards across all of our products, including
              Book with Snivel, Sigs by Snivel, and the Snivel scheduling platform.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Conformance Status</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              We aim to conform to the{" "}
              <a href="https://www.w3.org/TR/WCAG21/" class="text-blue-600 hover:text-blue-800">
                Web Content Accessibility Guidelines (WCAG) 2.1
              </a>{" "}
              at the AA level. These guidelines explain how to make web content more accessible to
              people with a wide array of disabilities, including visual, auditory, physical, speech,
              cognitive, language, learning, and neurological disabilities.
            </p>
            <p class="text-gray-600 leading-relaxed mb-3">
              While we strive for full AA conformance, some content may not yet fully meet
              all criteria. We are actively working to identify and resolve accessibility
              barriers.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Measures We Take</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              SNIVEL takes the following measures to ensure accessibility:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Include accessibility as part of our development process</li>
              <li>Provide skip navigation links on all pages</li>
              <li>Ensure sufficient color contrast ratios meet WCAG AA standards (minimum 4.5:1 for normal text)</li>
              <li>Use semantic HTML elements and ARIA attributes where appropriate</li>
              <li>Support keyboard navigation throughout the application</li>
              <li>Provide text alternatives for decorative and informational images</li>
              <li>Associate form labels with their corresponding inputs</li>
              <li>Use appropriate ARIA roles for dynamic content and modal dialogs</li>
              <li>Test with assistive technologies and automated accessibility tools</li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Compatibility</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              SNIVEL is designed to be compatible with the following assistive technologies:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>Screen readers (including VoiceOver, NVDA, and JAWS)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
            <p class="text-gray-600 leading-relaxed mt-3">
              SNIVEL is designed to work with current versions of major web browsers including
              Chrome, Firefox, Safari, and Edge.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Known Limitations</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              Despite our efforts to ensure accessibility, there may be some limitations.
              Below is a description of known limitations and potential solutions:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Email signature previews:</strong> The signature template editor renders
                HTML email signatures that may contain complex table-based layouts. We provide
                text descriptions and field labels alongside visual previews.
              </li>
              <li>
                <strong>Calendar interfaces:</strong> The booking calendar relies on a visual
                date and time grid. We provide keyboard navigation and clear labeling for
                date selection controls.
              </li>
              <li>
                <strong>Third-party content:</strong> Some content provided by third-party
                services (such as payment processing through Stripe) may not fully meet our
                accessibility standards.
              </li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Feedback</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              We welcome your feedback on the accessibility of SNIVEL. If you encounter
              accessibility barriers or have suggestions for improvement, please contact us:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                Email:{" "}
                <a href="mailto:accessibility@getsnivel.com" class="text-blue-600 hover:text-blue-800">
                  accessibility@getsnivel.com
                </a>
              </li>
              <li>
                General support:{" "}
                <a href="mailto:support@getsnivel.com" class="text-blue-600 hover:text-blue-800">
                  support@getsnivel.com
                </a>
              </li>
            </ul>
            <p class="text-gray-600 leading-relaxed mt-3">
              We try to respond to accessibility feedback within 5 business days.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Technical Specifications</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              Accessibility of SNIVEL relies on the following technologies to work with the
              particular combination of web browser and assistive technologies or plugins
              installed on your computer:
            </p>
            <ul class="list-disc pl-6 text-gray-600 space-y-2">
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
            <p class="text-gray-600 leading-relaxed mt-3">
              These technologies are relied upon for conformance with the accessibility
              standards used.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Enforcement</h2>
            <p class="text-gray-600 leading-relaxed mb-3">
              If you are not satisfied with our response to your accessibility concern, you
              may file a complaint with the{" "}
              <a href="https://www.ada.gov/file-a-complaint/" class="text-blue-600 hover:text-blue-800">
                U.S. Department of Justice
              </a>{" "}
              or contact your local disability rights organization.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer class="border-t border-gray-200 py-8 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">2026 SNIVEL. All rights reserved.</span>
            <div class="flex gap-6">
              <a href="/pricing" class="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="/terms" class="text-gray-600 hover:text-gray-900">Terms</a>
              <a href="/privacy" class="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="/accessibility" class="text-gray-600 hover:text-gray-900">Accessibility</a>
              <a href="/login" class="text-gray-600 hover:text-gray-900">Login</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});
