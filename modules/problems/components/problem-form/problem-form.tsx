"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, CheckCircle2, Code2, Copy, FileText, FlaskConical, Layers, Lightbulb, Loader2, Plus, Save, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { Markdown } from "@/components/shared/markdown";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DIFFICULTIES, DIFFICULTY_META } from "@/config/difficulty";
import { LANGUAGE_IDS, LANGUAGES, mapLanguages, type LanguageId } from "@/config/languages";
import { TOPICS, type TopicId } from "@/config/topics";
import { cn } from "@/lib/utils";
import { createProblem, listProblemTitles, updateProblem } from "../../actions";
import { problemsByType } from "../../data/sampleProblems";
import { problemFormSchema, type ProblemFormValues } from "../../schema";
import { CodeField, FieldError, FormSection, TagInput } from "./form-fields";

const SECTIONS = [
	{ id: "basics", label: "Basics", icon: Layers, fields: ["title", "difficulty", "tags"] },
	{ id: "statement", label: "Statement", icon: FileText, fields: ["description"] },
	{ id: "examples", label: "Examples", icon: BookOpen, fields: ["examples"] },
	{ id: "testcases", label: "Test cases", icon: FlaskConical, fields: ["testCases"] },
	{ id: "code", label: "Code", icon: Code2, fields: ["codeSnippets", "referenceSolutions"] },
	{ id: "guidance", label: "Guidance", icon: Lightbulb, fields: ["constraints", "hints", "editorial"] },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function emptyProblemValues(): ProblemFormValues {
	return {
		title: "",
		description: "",
		difficulty: "EASY",
		tags: [],
		constraints: "",
		hints: "",
		editorial: "",
		testCases: [{ input: "", output: "" }],
		examples: mapLanguages(() => ({ input: "", output: "", explanation: "" })),
		codeSnippets: mapLanguages((language) => language.template),
		referenceSolutions: mapLanguages(() => ""),
	};
}

type SampleProblem = (typeof problemsByType)[TopicId][number];

function sampleToValues(sample: SampleProblem): ProblemFormValues {
	return {
		title: sample.title,
		description: sample.description,
		difficulty: sample.difficulty,
		tags: [...sample.tags],
		constraints: sample.constraints,
		hints: sample.hints ?? "",
		editorial: sample.editorial ?? "",
		testCases: sample.testCases.map((testCase) => ({ ...testCase })),
		examples: mapLanguages((language) => {
			const example = sample.examples[language.id as LanguageId];
			return { input: example.input, output: example.output, explanation: example.explanation ?? "" };
		}),
		codeSnippets: mapLanguages((language) => sample.codeSnippets[language.id as LanguageId] ?? language.template),
		referenceSolutions: mapLanguages((language) => sample.referenceSolutions[language.id as LanguageId] ?? ""),
	};
}

const hasErrors = (errors: FieldErrors<ProblemFormValues>, fields: readonly string[]) => fields.some((field) => field in errors);

type ProblemFormProps = { mode: "create" } | { mode: "edit"; problemId: string; defaultValues: ProblemFormValues };

export function ProblemForm(props: ProblemFormProps) {
	const router = useRouter();
	const [activeSection, setActiveSection] = useState<SectionId>("basics");
	const [codeLanguage, setCodeLanguage] = useState<LanguageId>(LANGUAGE_IDS[0]);
	const [exampleLanguage, setExampleLanguage] = useState<LanguageId>(LANGUAGE_IDS[0]);
	const [descriptionView, setDescriptionView] = useState<"write" | "preview">("write");
	const [sampleTopic, setSampleTopic] = useState<TopicId>(TOPICS[0].id);

	const {
		register,
		control,
		handleSubmit,
		reset,
		getValues,
		setValue,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<ProblemFormValues>({
		resolver: zodResolver(problemFormSchema),
		defaultValues: props.mode === "edit" ? props.defaultValues : emptyProblemValues(),
	});

	const testCases = useFieldArray({ control, name: "testCases" });
	const description = useWatch({ control, name: "description" });

	// Highlight the section currently in view
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting);
				if (visible.length > 0) setActiveSection(visible[0].target.id as SectionId);
			},
			{ rootMargin: "-30% 0px -60% 0px" },
		);
		SECTIONS.forEach((section) => {
			const node = document.getElementById(section.id);
			if (node) observer.observe(node);
		});
		return () => observer.disconnect();
	}, []);

	// Warn before leaving with unsaved changes
	useEffect(() => {
		if (!isDirty) return;
		const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, [isDirty]);

	const loadSample = async () => {
		const published = new Set((await listProblemTitles().catch(() => [] as string[])).map((title) => title.toLowerCase()));
		const sample = problemsByType[sampleTopic].find((candidate) => !published.has(candidate.title.toLowerCase()));
		if (!sample) {
			toast.error("Every sample in this topic is already published — try another topic.");
			return;
		}
		reset(sampleToValues(sample));
		toast.success(`Loaded sample “${sample.title}”`);
	};

	const copyExampleToAll = () => {
		const source = getValues(`examples.${exampleLanguage}`);
		LANGUAGE_IDS.forEach((id) => setValue(`examples.${id}`, { ...source }, { shouldDirty: true, shouldValidate: true }));
		toast.success(`Copied the ${LANGUAGES[exampleLanguage].label} example to every language`);
	};

	const onSubmit = async (values: ProblemFormValues) => {
		const result = props.mode === "create" ? await createProblem(values) : await updateProblem(props.problemId, values);
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		toast.success(props.mode === "create" ? "Problem published!" : "Changes saved");
		reset(values);
		router.push(`/problem/${result.data.id}`);
		router.refresh();
	};

	const onInvalid = (formErrors: FieldErrors<ProblemFormValues>) => {
		const first = SECTIONS.find((section) => hasErrors(formErrors, section.fields));
		toast.error("Some fields need attention", { description: first ? `Check the ${first.label.toLowerCase()} section.` : undefined });
		if (first) document.getElementById(first.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit, onInvalid)}
			className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]"
			noValidate
		>
			{/* Section navigation */}
			<aside className="hidden lg:block">
				<div className="sticky top-28 flex flex-col gap-4">
					<nav className="flex flex-col gap-0.5 rounded-2xl border bg-card/80 p-2 backdrop-blur">
						{SECTIONS.map((section) => {
							const invalid = hasErrors(errors, section.fields);
							return (
								<a
									key={section.id}
									href={`#${section.id}`}
									className={cn(
										"flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										activeSection === section.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
									)}
								>
									<section.icon className={cn("size-4", activeSection === section.id && "text-primary")} />
									{section.label}
									{invalid && <span className="ml-auto size-2 rounded-full bg-destructive" />}
								</a>
							);
						})}
					</nav>
					<Button
						type="submit"
						size="lg"
						disabled={isSubmitting}
						className="w-full font-semibold shadow-md shadow-primary/20"
					>
						{isSubmitting ? <Loader2 className="animate-spin" /> : props.mode === "create" ? <Sparkles /> : <Save />}
						{props.mode === "create" ? "Publish problem" : "Save changes"}
					</Button>
				</div>
			</aside>

			<div className="flex min-w-0 flex-col gap-6">
				{props.mode === "create" && (
					<div className="flex flex-col gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
						<div className="flex items-center gap-3">
							<span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
								<Wand2 className="size-4" />
							</span>
							<div className="flex flex-col">
								<span className="text-sm font-medium">Start from a sample</span>
								<span className="text-xs text-muted-foreground">Prefill every field with an unpublished problem from the sample library.</span>
							</div>
						</div>
						<div className="flex gap-2 sm:ml-auto">
							<Select
								value={sampleTopic}
								onValueChange={(value) => setSampleTopic(value as TopicId)}
							>
								<SelectTrigger className="w-48 bg-background/70">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{TOPICS.map((topic) => (
										<SelectItem
											key={topic.id}
											value={topic.id}
										>
											{topic.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								type="button"
								variant="outline"
								onClick={loadSample}
								className="bg-background/70"
							>
								Load
							</Button>
						</div>
					</div>
				)}

				<FormSection
					id="basics"
					title="Basics"
					description="How the problem appears in the problem set."
				>
					<div className="flex flex-col gap-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							placeholder="e.g. Two Sum"
							className="h-11 text-base"
							aria-invalid={Boolean(errors.title)}
							{...register("title")}
						/>
						<FieldError message={errors.title?.message} />
					</div>
					<div className="flex flex-col gap-2">
						<Label>Difficulty</Label>
						<Controller
							control={control}
							name="difficulty"
							render={({ field }) => (
								<SegmentedControl
									layoutId="form-difficulty"
									value={field.value}
									onChange={field.onChange}
									className="w-fit"
									options={DIFFICULTIES.map((d) => ({
										value: d,
										label: (
											<>
												<span className={cn("size-2 rounded-full", DIFFICULTY_META[d].classes.solid)} />
												{DIFFICULTY_META[d].label}
											</>
										),
									}))}
								/>
							)}
						/>
						<FieldError message={errors.difficulty?.message} />
					</div>
					<div className="flex flex-col gap-2">
						<Label>Tags</Label>
						<Controller
							control={control}
							name="tags"
							render={({ field }) => (
								<TagInput
									value={field.value}
									onChange={field.onChange}
									suggestions={TOPICS.map((topic) => topic.label)}
									invalid={Boolean(errors.tags)}
								/>
							)}
						/>
						<FieldError message={errors.tags?.message ?? errors.tags?.root?.message} />
					</div>
				</FormSection>

				<FormSection
					id="statement"
					title="Statement"
					description="Markdown is supported — use `code`, **bold**, lists and fenced code blocks."
					action={
						<SegmentedControl
							size="sm"
							layoutId="description-view"
							value={descriptionView}
							onChange={setDescriptionView}
							options={[
								{ value: "write", label: "Write" },
								{ value: "preview", label: "Preview" },
							]}
						/>
					}
				>
					{descriptionView === "write" ? (
						<Textarea
							placeholder="Describe the task, the input format and the expected output…"
							className="min-h-48 resize-y text-[15px] leading-relaxed"
							aria-invalid={Boolean(errors.description)}
							{...register("description")}
						/>
					) : (
						<div className="min-h-48 rounded-xl border bg-background/50 p-4">
							{description?.trim() ? (
								<Markdown
									content={description}
									breaks
								/>
							) : (
								<p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
							)}
						</div>
					)}
					<FieldError message={errors.description?.message} />
				</FormSection>

				<FormSection
					id="examples"
					title="Examples"
					description="Shown in the problem description. Each language can have its own example."
					action={
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={copyExampleToAll}
						>
							<Copy /> Copy to all languages
						</Button>
					}
				>
					<SegmentedControl
						size="sm"
						layoutId="example-language"
						value={exampleLanguage}
						onChange={setExampleLanguage}
						className="w-fit"
						options={LANGUAGE_IDS.map((id) => ({
							value: id,
							label: (
								<>
									{LANGUAGES[id].label}
									{errors.examples?.[id] && <span className="size-1.5 rounded-full bg-destructive" />}
								</>
							),
						}))}
					/>
					{LANGUAGE_IDS.map((id) => (
						<div
							key={id}
							className={cn("grid gap-4 md:grid-cols-2", id !== exampleLanguage && "hidden")}
						>
							<div className="flex flex-col gap-2">
								<Label>Input</Label>
								<Textarea
									placeholder="nums = [2,7,11,15], target = 9"
									className="min-h-24 resize-y font-mono text-sm"
									{...register(`examples.${id}.input`)}
								/>
								<FieldError message={errors.examples?.[id]?.input?.message} />
							</div>
							<div className="flex flex-col gap-2">
								<Label>Output</Label>
								<Textarea
									placeholder="[0,1]"
									className="min-h-24 resize-y font-mono text-sm"
									{...register(`examples.${id}.output`)}
								/>
								<FieldError message={errors.examples?.[id]?.output?.message} />
							</div>
							<div className="flex flex-col gap-2 md:col-span-2">
								<Label>
									Explanation <span className="font-normal text-muted-foreground">(optional)</span>
								</Label>
								<Textarea
									placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
									className="min-h-20 resize-y"
									{...register(`examples.${id}.explanation`)}
								/>
							</div>
						</div>
					))}
				</FormSection>

				<FormSection
					id="testcases"
					title="Test cases"
					description="Programs read the input from stdin; output is compared after trimming whitespace."
					action={
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={() => testCases.append({ input: "", output: "" })}
						>
							<Plus /> Add test case
						</Button>
					}
				>
					{testCases.fields.map((field, index) => (
						<div
							key={field.id}
							className="rounded-xl border bg-background/50 p-4"
						>
							<div className="mb-3 flex items-center justify-between">
								<span className="inline-flex items-center gap-2 text-sm font-medium">
									<span className="grid size-6 place-items-center rounded-md bg-primary/15 font-mono text-xs text-primary">{index + 1}</span>
									Test case
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => testCases.remove(index)}
									disabled={testCases.fields.length === 1}
									aria-label={`Remove test case ${index + 1}`}
									className="text-muted-foreground hover:text-destructive"
								>
									<Trash2 />
								</Button>
							</div>
							<div className="grid gap-3 md:grid-cols-2">
								<div className="flex flex-col gap-1.5">
									<Label className="text-xs text-muted-foreground">Input (stdin)</Label>
									<Textarea
										className="min-h-20 resize-y font-mono text-sm"
										aria-invalid={Boolean(errors.testCases?.[index]?.input)}
										{...register(`testCases.${index}.input`)}
									/>
									<FieldError message={errors.testCases?.[index]?.input?.message} />
								</div>
								<div className="flex flex-col gap-1.5">
									<Label className="text-xs text-muted-foreground">Expected output (stdout)</Label>
									<Textarea
										className="min-h-20 resize-y font-mono text-sm"
										aria-invalid={Boolean(errors.testCases?.[index]?.output)}
										{...register(`testCases.${index}.output`)}
									/>
									<FieldError message={errors.testCases?.[index]?.output?.message} />
								</div>
							</div>
						</div>
					))}
					<FieldError message={errors.testCases?.message ?? errors.testCases?.root?.message} />
				</FormSection>

				<FormSection
					id="code"
					title="Code"
					description="Starter code is what solvers see first; the reference solution documents a correct answer."
				>
					<SegmentedControl
						size="sm"
						layoutId="code-language"
						value={codeLanguage}
						onChange={setCodeLanguage}
						className="w-fit"
						options={LANGUAGE_IDS.map((id) => ({
							value: id,
							label: (
								<>
									<span
										className="size-2 rounded-full"
										style={{ backgroundColor: LANGUAGES[id].color }}
									/>
									{LANGUAGES[id].label}
									{(errors.codeSnippets?.[id] || errors.referenceSolutions?.[id]) && <span className="size-1.5 rounded-full bg-destructive" />}
								</>
							),
						}))}
					/>
					<div className="grid gap-4 xl:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label className="flex items-center gap-2">
								<Code2 className="size-4 text-muted-foreground" /> Starter code
							</Label>
							<Controller
								key={`snippet-${codeLanguage}`}
								control={control}
								name={`codeSnippets.${codeLanguage}`}
								render={({ field }) => (
									<CodeField
										path={`starter-${codeLanguage}`}
										language={codeLanguage}
										value={field.value}
										onChange={field.onChange}
										invalid={Boolean(errors.codeSnippets?.[codeLanguage])}
									/>
								)}
							/>
							<FieldError message={errors.codeSnippets?.[codeLanguage]?.message} />
						</div>
						<div className="flex flex-col gap-2">
							<Label className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-success" /> Reference solution
							</Label>
							<Controller
								key={`reference-${codeLanguage}`}
								control={control}
								name={`referenceSolutions.${codeLanguage}`}
								render={({ field }) => (
									<CodeField
										path={`reference-${codeLanguage}`}
										language={codeLanguage}
										value={field.value}
										onChange={field.onChange}
										invalid={Boolean(errors.referenceSolutions?.[codeLanguage])}
									/>
								)}
							/>
							<FieldError message={errors.referenceSolutions?.[codeLanguage]?.message} />
						</div>
					</div>
				</FormSection>

				<FormSection
					id="guidance"
					title="Guidance"
					description="Constraints are required; hints and the editorial help solvers who get stuck."
				>
					<div className="flex flex-col gap-2">
						<Label>Constraints</Label>
						<Textarea
							placeholder={"1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9"}
							className="min-h-24 resize-y font-mono text-sm"
							aria-invalid={Boolean(errors.constraints)}
							{...register("constraints")}
						/>
						<FieldError message={errors.constraints?.message} />
					</div>
					<div className="flex flex-col gap-2">
						<Label>
							Hints <span className="font-normal text-muted-foreground">(one per line, revealed progressively)</span>
						</Label>
						<Textarea
							placeholder={"Think about what you need to remember while scanning the array.\nA hash map gives O(1) lookups."}
							className="min-h-24 resize-y"
							{...register("hints")}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>
							Editorial <span className="font-normal text-muted-foreground">(Markdown, optional)</span>
						</Label>
						<Textarea
							placeholder="Walk through the intuition, the algorithm and its complexity…"
							className="min-h-36 resize-y"
							{...register("editorial")}
						/>
					</div>
				</FormSection>

				{/* Mobile submit bar */}
				<div className="sticky bottom-3 z-10 lg:hidden">
					<Button
						type="submit"
						size="lg"
						disabled={isSubmitting}
						className="w-full font-semibold shadow-xl shadow-primary/25"
					>
						{isSubmitting ? <Loader2 className="animate-spin" /> : props.mode === "create" ? <Sparkles /> : <Save />}
						{props.mode === "create" ? "Publish problem" : "Save changes"}
					</Button>
				</div>
			</div>
		</form>
	);
}
