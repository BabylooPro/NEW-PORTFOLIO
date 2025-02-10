import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const PrivacyPolicy = () => {
    return (
        <Section className="prose dark:prose-invert">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective Date: 10/02/2025</p>

            <div className="pt-4 space-y-8">
                <div>
                    <p>
                        Thank you for visiting my portfolio website. Your privacy is important to me, and I am committed to protecting the personal information you share while using this Website. This Privacy Policy outlines the types of information collected, how it is used, and your rights regarding your data.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">1. Information I Collect</h2>
                    <div className="pl-4">
                        <h3 className="text-xl mt-4">1.1 Automatically Collected Information:</h3>
                        <ul className="list-disc pl-6">
                            <li><strong>Usage Data</strong>: I collect data such as IP addresses, browser type, operating system, referring URLs, and the pages you visit on my Website.</li>
                        </ul>

                        <h3 className="text-xl mt-4">1.2 Information You Provide Voluntarily:</h3>
                        <ul className="list-disc pl-6">
                            <li><strong>Contact Form Data</strong>: When you contact me, I collect your name, email address, and any additional information you include in your message.</li>
                        </ul>
                    </div>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">2. How I Use Your Information</h2>
                    <p>I use the information collected for the following purposes:</p>
                    <ul className="list-disc pl-6">
                        <li>To improve the functionality and user experience of the Website.</li>
                        <li>To respond to your inquiries or requests submitted via the contact form.</li>
                        <li>To monitor Website performance and security.</li>
                        <li>To comply with legal obligations.</li>
                    </ul>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">3. Third-Party Services</h2>
                    <p>
                        I may use third-party services for hosting and other purposes. These services may collect and process your data in compliance with their privacy policies. Examples include:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>GitHub</strong>: To display my projects and repositories.</li>
                        <li><strong>Amazon Web Services</strong>: Specifically, the EC2 service is used to host this Website.</li>
                    </ul>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">4. Data Retention</h2>
                    <p>
                        I retain your data only as long as necessary for the purposes outlined in this Privacy Policy, or as required by law.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6">
                        <li>Access, update, or delete any personal data I hold about you.</li>
                        <li>Lodge a complaint with a data protection authority if you believe your rights are violated.</li>
                    </ul>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">6. Data Security</h2>
                    <p>
                        I take reasonable measures to protect your data from unauthorized access, alteration, or destruction. However, no online platform can guarantee 100% security.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">7. Links to External Websites</h2>
                    <p>
                        My Website may contain links to external websites. I am not responsible for the content or privacy practices of these third-party sites.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">8. Updates to This Privacy Policy</h2>
                    <p>
                        I may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Effective Date.&quot; Please review this policy periodically.
                    </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-semibold">9. Contact Information</h2>
                    <p>
                        If you have any questions about this Privacy Policy or wish to exercise your rights, please contact me at:
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
                        The source code for this Website is released under the MIT License. This means that while your personal data is protected under this Privacy Policy, the code itself can be freely used, modified, and distributed under the terms of the MIT License.
                    </p>
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
                        By using this Website, you consent to the terms of this Privacy Policy.
                    </p>
                </div>
            </div>
        </Section>
    );
};
