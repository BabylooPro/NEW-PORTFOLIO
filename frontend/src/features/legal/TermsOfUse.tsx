import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const TermsOfUse = () => {
    return (
        <Section className="prose dark:prose-invert">
            <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
            <p className="text-muted-foreground">Effective Date: 10/02/2025</p>

            <div className="pt-4 space-y-8">
                <div>
                    <p>
                        Welcome to my portfolio website. By accessing and using this Website, you accept and agree to be bound by these Terms of Use. Please read them carefully before using the Website.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                    <p>
                        By accessing this Website, you acknowledge that you have read, understood, and agree to comply with these Terms of Use. If you do not agree with any part of these terms, please do not use this Website.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">2. Intellectual Property Rights</h2>
                    <div className="pl-4">
                        <p>
                            All content on this Website, including but not limited to text, graphics, logos, images, code snippets, and design elements, is my property and is protected by intellectual property laws.
                        </p>
                        <ul className="list-disc pl-6 mt-4">
                            <li>You may view and download content for personal, non-commercial use only.</li>
                            <li>Any use of content without my express written permission is prohibited.</li>
                            <li>The source code shown in projects may have specific licenses that must be respected.</li>
                        </ul>
                    </div>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">3. User Conduct</h2>
                    <p>When using this Website, you agree not to:</p>
                    <ul className="list-disc pl-6">
                        <li>Use the Website in any unlawful manner</li>
                        <li>Attempt to gain unauthorized access to any part of the Website</li>
                        <li>Use the Website to transmit malicious software or harmful data</li>
                        <li>Impersonate any person or entity</li>
                    </ul>
                    <p className="mt-4">
                        Note: While the Website's source code is available under the MIT License and can be freely used,
                        modified and distributed (see Section 11), the content, images, and branding elements remain
                        protected by copyright unless otherwise specified.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">4. Contact Form</h2>
                    <p>
                        When using the contact form, you agree to:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Provide accurate and truthful information</li>
                        <li>Not send spam, solicitations, or inappropriate content</li>
                        <li>Accept that I may store and process your information as described in the Privacy Policy</li>
                    </ul>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">5. Third-Party Links</h2>
                    <p>
                        This Website may contain links to third-party websites. I am not responsible for:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>The content of any linked website</li>
                        <li>Any damage or loss from using third-party services</li>
                        <li>The privacy practices of linked websites</li>
                    </ul>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">6. Disclaimer</h2>
                    <p>
                        This Website is provided "as is" without any warranties, express or implied. I do not guarantee that:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>The Website will be available at all times</li>
                        <li>The information will be error-free or up-to-date</li>
                        <li>The Website will be free from viruses or other harmful components</li>
                    </ul>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, I shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Website.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
                    <p>
                        I reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to the Website. Your continued use of the Website after any changes indicates your acceptance of the modified terms.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">9. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Use, please contact me at:
                    </p>
                    <div className="mt-4">
                        <p className="font-semibold">Max Remy / Max Remy Dev</p>
                        <p>Email: <a target="_blank" href="mailto:maxremy.dev@gmail.com" className="text-primary hover:underline">maxremy.dev@gmail.com</a></p>
                        <p>Phone: <a target="_blank" href="tel:+41798730605" className="text-primary hover:underline">+41 79 873 06 05</a></p>
                    </div>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">10. Source Code</h2>
                    <p>
                        The source code for this Website is available on GitHub. You can access it at: <br />
                        <Link target="_blank" href="https://github.com/BabylooPro/NEW-PORTFOLIO" className="text-primary hover:underline">https://github.com/BabylooPro/NEW-PORTFOLIO</Link>
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">11. Source Code License</h2>
                    <p>
                        The source code for this Website is released under the MIT License, which means:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>You can use, copy, modify, merge, publish, distribute, and sell copies of the code</li>
                        <li>You must include the original copyright notice and MIT License in any copy of the code</li>
                        <li>The software is provided "as is" without warranty of any kind</li>
                    </ul>
                    <p className="mt-4">
                        For the complete license terms, please see the LICENSE file in the GitHub repository: <br />
                        <Link target="_blank" href="https://github.com/BabylooPro/NEW-PORTFOLIO/blob/main/LICENSE" className="text-primary hover:underline">
                            https://github.com/BabylooPro/NEW-PORTFOLIO/blob/main/LICENSE
                        </Link>
                    </p>
                </div>

                <Separator />

                <div>
                    <p className="italic">
                        By using this Website, you acknowledge that you have read, understood, and agree to these Terms of Use.
                    </p>
                </div>
            </div>
        </Section>
    );
};
