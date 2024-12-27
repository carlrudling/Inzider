import { notFound } from 'next/navigation';
import CreatorLandingPage from '@/components/CreatorLandingPage';
import dbConnect from '@/utils/database';
import Creator from '@/models/Creator';

async function getCreatorData(username: string) {
  await dbConnect();
  const creator = await Creator.findOne({ username });

  if (!creator) {
    return null;
  }

  return {
    backgroundImage: creator.backgroundImage,
    profileImage: creator.profileImage,
    creatorName: creator.name,
    description: creator.description,
    instagramLink: creator.instagram,
    twitterLink: creator.xLink,
    buttonColor: creator.buttonColor || creator.tripButtonColor,
    buttonTextColor: creator.buttonTextColor || creator.tripButtonText,
    textColor: creator.textColor,
  };
}

export default async function CreatorPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const creatorData = await getCreatorData(username);

  if (!creatorData) {
    notFound();
  }

  return <CreatorLandingPage {...creatorData} username={username} />;
}
