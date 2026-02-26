"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
	try {
		const user = await currentUser();
		if (!user) {
			return {
				success: false,
				error: "No authenticated user found",
			};
		}

        const { id, firstName, lastName, imageUrl, emailAddresses } = user;
        
        const newUser = await db.user.upsert({
            where: {
                clerkID: id
            },
            update: {
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || ""

            },
            create: {
                clerkID: id,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || ""
            }
        })

        return {
            success: true,
            user: newUser,
            message: "User onboarded successfully",
        }
	} catch (error) {
		console.error("Error fetching current user:", error);
		return {
			success: false,
			error: "Failed to onboard user",
		};
	}
};

export const currentUserRole = async () => { 
    try {
        const user = await currentUser();
        if (!user) {
            return "USER";
        }
        const { id } = user;
        const userRole = await db.user.findUnique({
            where: {
                clerkID: id
            },
            select: {
                role: true
            }
        })
        return userRole?.role || "USER";

    } catch (error) {
        console.error("Error fetching user role:", error);
        return "USER";
     }
}