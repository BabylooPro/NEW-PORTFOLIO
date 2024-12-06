"use client";

import React, { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWhatIDoSection } from "./utils/useWhatIDoSection";

const WhatIDoData = [
	// BACKEND PROJECT: USER MANAGEMENT WITH AN ENDPOINT TO FETCH USERS
	{
		title: "Backend Development",
		file: "UsersController.cs",
		language: "csharp",
		snippetHeight: 555,
		snippet: `  using Microsoft.AspNetCore.Mvc;

 [ApiController]
 [Route("api/[controller]")]
 public class UsersController : ControllerBase
 {
     private readonly IUserService _userService;

     public UsersController(IUserService userService)
     {
         _userService = userService;
     }

     [HttpGet]
     public IActionResult GetUsers()
     {
         var users = _userService.GetAllUsers(); // Fetch users from the service
         return Ok(users);
     }
 }`,
	},

	// PYTHON PROJECT: PAYMENT PROCESSING USING STRATEGY PATTERN
	{
		title: "Software Engineering",
		file: "payment_processor.py",
		language: "python",
		snippetHeight: 620,
		snippet: `  from abc import ABC, abstractmethod

 class PaymentProcessor(ABC):
     @abstractmethod
     def process_payment(self, amount: float) -> bool:
         pass

 class StripeProcessor(PaymentProcessor):
     def process_payment(self, amount: float) -> bool:
         # IMPLEMENT STRIPE PAYMENT LOGIC
         print(f"Processing {amount} via Stripe")
         return True

 class PayPalProcessor(PaymentProcessor):
     def process_payment(self, amount: float) -> bool:
         # IMPLEMENT PAYPAL PAYMENT LOGIC
         print(f"Processing {amount} via PayPal")
         return True

 def process_order(payment_method: PaymentProcessor, amount: float):
     if payment_method.process_payment(amount):
         print("Payment successful!")
     else:
         print("Payment failed.")`,
	},

	// REACT PROJECT: SIMPLE COUNTER COMPONENT WITH USESTATE HOOK
	{
		title: "Frontend Development",
		file: "Counter.jsx",
		language: "javascript",
		snippetHeight: 450,
		snippet: `  import React, { useState } from 'react';

 const Counter = () => {
   const [count, setCount] = useState(0);

   return (
     <div>
       <p>You clicked {count} times</p>
       <button onClick={() => setCount(count + 1)}>
         Click me
       </button>
     </div>
   );
 };

 export default Counter;`,
	},

	// NEXT.JS PROJECT: FETCHING DATA FROM AN API ROUTE
	{
		title: "Full Stack Development",
		file: "index.tsx",
		language: "typescript",
		snippetHeight: 635,
		snippet: `  // app/api/data.ts
 import type { NextApiRequest, NextApiResponse } from 'next';

 export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
 ) {
   const data = await fetchDataFromDatabase(); // Mock function to simulate database fetch
   res.status(200).json(data);
 }

 // app/page.tsx
 import { useEffect, useState } from 'react';

 export default function Home() {
   const [data, setData] = useState(null);

   useEffect(() => {
     fetch('/api/data')
       .then((res) => res.json())
       .then(setData);
   }, []);

   return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
 }`,
	},

	// DOCKER PROJECT: BASIC SETUP WITH A WEB SERVICE, DATABASE, AND REDIS
	{
		title: "DevOps",
		file: "docker-compose.yml",
		language: "yaml",
		snippetHeight: 500,
		snippet: `  version: '3'
 services:
   web:
     build: .
     ports:
       - "8000:8000"
     depends_on:
       - db
   db:
     image: postgres:13
     environment:
       POSTGRES_DB: myapp
       POSTGRES_USER: user
       POSTGRES_PASSWORD: password
   redis:
     image: "redis:alpine"

 # DEPLOY WITH: docker-compose up -d`,
	},
];

const TypedSyntaxHighlighter: React.FC<{ code: string; language: string }> = ({
	code,
	language,
}) => {
	const [displayedCode, setDisplayedCode] = useState("");
	const [showCursor, setShowCursor] = useState(true);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		let index = 0;
		const typingInterval = setInterval(() => {
			setDisplayedCode((prev) => prev + code[index]);
			index++;
			if (index === code.length) {
				clearInterval(typingInterval);
				const cursorInterval = setInterval(() => {
					setShowCursor((prev) => !prev);
				}, 500);
				return () => clearInterval(cursorInterval);
			}
		}, 20);

		return () => clearInterval(typingInterval);
	}, [code]);

	return (
		<div className={resolvedTheme === "dark" ? "bg-neutral-900" : "bg-white"}>
			<SyntaxHighlighter
				language={language}
				style={resolvedTheme === "dark" ? vscDarkPlus : vs}
				customStyle={{
					color: resolvedTheme === "dark" ? "#D4D4D4" : "#333333",
					padding: 0,
					margin: 0,
					fontSize: "0.875rem",
					border: "none",
					overflowX: "auto",
					backgroundColor: resolvedTheme === "dark" ? "#171717" : "#ffffff",
				}}
				codeTagProps={{
					style: {
						fontFamily: "inherit",
						backgroundColor: resolvedTheme === "dark" ? "#171717" : "#ffffff",
					}
				}}
			>
				{displayedCode + (showCursor ? "|" : " ")}
			</SyntaxHighlighter>
		</div>
	);
};

const WhatIDoSection: React.FC = () => {
	const { resolvedTheme } = useTheme();
	const [activeTab, setActiveTab] = useState(WhatIDoData[0].file);
	const [isMounted, setIsMounted] = useState(false);
	const { data: sectionData, isLoading } = useWhatIDoSection();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!resolvedTheme || !isMounted || isLoading) {
		return null;
	}

	const activeSnippet = WhatIDoData.find((item) => item.file === activeTab);
	const contentHeight = activeSnippet ? activeSnippet.snippetHeight : 0;

	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				{sectionData?.title || "What I Do"}
				<ShowInfo
					description={
						<>
							{sectionData?.titleDescription} <br />{" "}
							<span className="text-xs text-neutral-500">
								{sectionData?.paragraphDescription}
							</span>
						</>
					}
				/>
			</h2>

			<Tabs defaultValue={WhatIDoData[0].file} onValueChange={setActiveTab}>
				{WhatIDoData.map((vscode) => (
					<TabsContent
						key={vscode.file}
						value={vscode.file}
						style={{ minHeight: `${contentHeight}px` }}
					>
						<Card
							className={`rounded-lg overflow-hidden border-none ${
								resolvedTheme === "dark"
									? "bg-neutral-900 text-white"
									: "bg-white text-black"
							}`}
						>
							<CardHeader
								className={`p-0 flex items-center h-8 relative ${
									resolvedTheme === "dark" ? "bg-neutral-800" : "bg-neutral-200"
								}`}
							>
								<div className="flex space-x-2 mt-[10px] ml-4 items-center absolute left-0">
									<div className="w-3 h-3 rounded-full bg-red-500" />
									<div className="w-3 h-3 rounded-full bg-yellow-500" />
									<div className="w-3 h-3 rounded-full bg-green-500" />
								</div>
								<div className="text-sm font-semibold w-full text-center">
									{vscode.title}
								</div>
							</CardHeader>
							<ScrollArea className="w-full">
								<TabsList className="mb-4 space-x-2 bg-transparent p-4 rounded-lg inline-flex w-max">
									{WhatIDoData.map((vscode) => (
										<TabsTrigger
											key={vscode.file}
											value={vscode.file}
											className="data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800"
										>
											{vscode.file}
										</TabsTrigger>
									))}
								</TabsList>
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
							<CardContent
								className={` ${
									resolvedTheme === "dark" ? "bg-neutral-900" : "bg-white"
								} transition-all ease-in-out`}
							>
								<TypedSyntaxHighlighter
									code={vscode.snippet}
									language={vscode.language}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</Section>
	);
};

export default WhatIDoSection;
