/*
  EDIT YOUR INVITATION HERE
  - Set weddingDate to your actual date/time in ISO format.
  - Replace sample venue and event details.
  - Add your own photos in assets/gallery/ and update gallery[].image.
  - Add a licensed MP3 file at assets/music/replace-with-your-song.mp3.
*/
window.WEDDING_CONFIG = {
  groom: "Ankit",
  bride: "Swati",
  weddingDate: "2026-11-25T19:00:00+05:30", // CHANGE THIS
  dateLabel: "25 November 2026 · Save the Date", // CHANGE THIS
  venueName: "Wedding venue to be announced",
  venueAddress: "Add your full venue address in config.js",
  mapUrl: "https://maps.google.com",
  events: [
    { icon: "✧", name: "Haldi", date: "Date to be announced", time: "Time to be announced", venue: "Venue to be announced", note: "A golden morning filled with blessings and laughter." },
    { icon: "❀", name: "Mehendi", date: "Date to be announced", time: "Time to be announced", venue: "Venue to be announced", note: "Colour, music, and joyful memories with our loved ones." },
    { icon: "♡", name: "Wedding Ceremony", date: "Date to be announced", time: "Time to be announced", venue: "Venue to be announced", note: "The moment our forever begins." },
    { icon: "✦", name: "Reception", date: "Date to be announced", time: "Time to be announced", venue: "Venue to be announced", note: "Join us for a night of celebration and togetherness." }
  ],
  gallery: [
    { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85", alt: "Wedding ceremony flowers" },
    { image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85", alt: "Wedding couple portrait" },
    { image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85", alt: "Wedding celebration" },
    { image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85", alt: "Wedding details" },
    { image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85", alt: "Wedding reception table" },
    { image: "https://images.unsplash.com/photo-1507504031003-b417219a0?auto=format&fit=crop&w=900&q=85", alt: "Romantic wedding flowers" }
  ]
};
