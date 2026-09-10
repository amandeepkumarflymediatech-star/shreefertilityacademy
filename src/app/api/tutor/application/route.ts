import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      action, // 'SAVE' or 'SUBMIT'
      name,
      phone,
      timezone,
      bio,
      experience,
      qualifications,
      languages,
      teachingHeadline,
      teachingLevels,
      teachingAges,
      teachingStyle,
    } = body;

    const onboardingStatus =
      action === "SUBMIT" ? "UNDER_REVIEW" : "IN_PROGRESS";

    // Update user profile
    await User.update({
      name: name || undefined,
      phone: phone || undefined,
      timezone: timezone || undefined,
      bio: bio || undefined,
      experience: experience || undefined,
      qualifications: qualifications || undefined,
      languages: languages || undefined,
      teachingHeadline: teachingHeadline || undefined,
      teachingLevels: teachingLevels || undefined,
      teachingAges: teachingAges || undefined,
      teachingStyle: teachingStyle || undefined,
      onboardingStatus,
    }, {
      where: { id: userId }
    });

    const updatedUser = await User.findByPk(userId);

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error: any) {
    console.error("Error in tutor application API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
