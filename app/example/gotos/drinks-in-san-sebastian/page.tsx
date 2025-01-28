'use client';
import AboutPageComponent from '@/components/AboutPageComponent';

export default function ExampleGoToPage() {
  const exampleData = {
    title: 'Drinks in San Sebastian',
    price: '19.99',
    currency: 'EUR',
    slides: [
      {
        type: 'image' as const,
        src: '/images/drinksSansebastian.jpg',
      },
      {
        type: 'image' as const,
        src: '/images/drinksSansebastian2.jpg',
      },
    ],
    specifics: [
      { label: 'Duration', value: '1 evening' },
      { label: 'Best time', value: 'Thursday-Saturday' },
      { label: 'Locations', value: '5 bars' },
      { label: 'Language', value: 'English' },
    ],
    creatorWords:
      "As someone who grew up in San Sebastian, I've spent countless nights exploring the vibrant bar scene. This guide includes my top 5 favorite spots, from traditional pintxo bars to modern cocktail lounges. Each location has been carefully selected to give you an authentic taste of San Sebastian's nightlife.",
    reviewCount: 12,
    averageRating: 4.8,
    purchaseCount: 45,
    reviews: [
      {
        rating: 5,
        text: 'Amazing recommendations! Every spot was exactly as described and we had an unforgettable night.',
        userName: 'Sarah T.',
      },
      {
        rating: 5,
        text: 'The local insights made our evening so special. Would never have found these gems on our own!',
        userName: 'Michael R.',
      },
      {
        rating: 4,
        text: 'Great selection of bars, really helped us experience the local nightlife.',
        userName: 'James L.',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <AboutPageComponent
        title={exampleData.title}
        price={exampleData.price}
        currency={exampleData.currency}
        slides={exampleData.slides}
        specifics={exampleData.specifics}
        creatorWords={exampleData.creatorWords}
        reviewCount={exampleData.reviewCount}
        averageRating={exampleData.averageRating}
        purchaseCount={exampleData.purchaseCount}
        status="launch"
        contentType="goto"
        id="example"
        username="example"
        reviews={exampleData.reviews}
        onGetItClick={() =>
          alert('This is a preview. Sign up to create your own GoTos!')
        }
      />
    </div>
  );
}
