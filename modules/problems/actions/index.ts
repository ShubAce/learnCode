"use server";

import { db } from "@/lib/db";
import { UserRole } from "@/src/generated/browser";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export const getAllProblems = async () => {
	try {
		const user = await currentUser();
		const data = await db.user.findUnique({
			where: {
				clerkID: user?.id,
			},
			select: {
				id: true,
			},
		});

		const problems = await db.problem.findMany({
			include: {
				solvedBy: {
					where: {
						userId: data?.id,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return {
			success: true,
			data: problems,
		};
	} catch (error) {
		console.error("Error fetching problems:", error);
		return {
			success: false,
			error: "An error occurred while fetching problems.",
		};
	}
};

export const getProblemById = async (id: string) => {
	try {
		const problem = await db.problem.findUnique({
			where: {
				id: id,
			},
		});
		return {
			success: true,
			data: problem,
		};
	} catch (error) {
		console.error("Error fetching problem by ID:", error);
		return {
			success: false,
			error: "An error occurred while fetching the problem.",
		};
	}
};

export const deleteProblem = async (problemId: string) => {
	try {
		const user = await currentUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		const dbUser = await db.user.findUnique({
			where: {
				clerkID: user.id,
			},
			select: {
				role: true,
			},
        });
        if (dbUser?.role !== UserRole.ADMIN) {
            throw new Error("Only ADMIN can delete problems");
        }

        await db.problem.delete({
            where: {
                id: problemId,
            },
        });

        revalidatePath("/problems");
        return {
            success: true,
            message: "Problem deleted successfully",
        }
	} catch (error) {
		console.error("Error deleting problem:", error);
		return {
			success: false,
			error: "An error occurred while deleting the problem.",
		};
	}
};
