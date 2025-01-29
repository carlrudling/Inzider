import { notFound } from 'next/navigation';
import CreatorLandingPage from '@/components/CreatorLandingPage';
import dbConnect from '@/utils/database';
import Creator from '@/models/Creator';
import GoTo from '@/models/GoTo';
import Trip from '@/models/Trip';

async function getCreatorData(username: string) {
  await dbConnect();
  const creator = await Creator.findOne({ username });

  if (!creator) {
    return null;
  }

  // Check for launched gotos and trips
  const [gotos, trips] = await Promise.all([
    GoTo.find({ creatorId: creator._id, status: 'launch' }).lean(),
    Trip.find({ creatorId: creator._id, status: 'launch' }).lean(),
  ]);

  return {
    backgroundImage: creator.backgroundImage,
    profileImage: creator.profileImage,
    creatorName: creator.name,
    description: creator.description,
    instagramLink: creator.instagram,
    twitterLink: creator.xLink,
    buttonColor: creator.buttonColor,
    buttonTextColor: creator.buttonTextColor,
    textColor: creator.textColor,
    hasLaunchedGotos: gotos.length > 0,
    hasLaunchedTrips: trips.length > 0,
  };
}

export default async function CreatorPage({
  params,
}: {
  params: { username: string };
}) {
  const creatorData = await getCreatorData(params.username);

  if (!creatorData) {
    notFound();
  }

  return <CreatorLandingPage {...creatorData} username={params.username} />;
}
