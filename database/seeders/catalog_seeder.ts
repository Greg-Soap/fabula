import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Novel from '#models/novel'
import Series from '#models/series'

export default class extends BaseSeeder {
  async run() {
    const seriesData = [
      {
        title: 'Breaking Bad',
        slug: 'breaking-bad',
        shortDescription:
          'A high school chemistry teacher turned methamphetamine producer teams up with a former student.',
        longDescription:
          "Breaking Bad follows Walter White, a struggling high school chemistry teacher diagnosed with cancer. To secure his family's financial future, he partners with former student Jesse Pinkman to produce and sell crystal meth. The series explores morality, transformation, and the consequences of choices.",
        rating: 9.5,
        personalReview:
          'A masterclass in tension and character development. One of the best TV dramas ever made.',
        trailerUrl: 'https://www.youtube.com/watch?v=HhesaQXLuYw',
        numberOfSeasons: 5,
      },
      {
        title: 'Game of Thrones',
        slug: 'game-of-thrones',
        shortDescription:
          'Noble families fight for control of the Iron Throne in the Seven Kingdoms of Westeros.',
        longDescription:
          "Game of Thrones is a fantasy drama set in the fictional continents of Westeros and Essos. Multiple plot lines follow a large ensemble cast as they navigate political intrigue, warfare, and supernatural threats. Based on George R. R. Martin's A Song of Ice and Fire.",
        rating: 9.2,
        personalReview:
          'Epic scale and unforgettable characters. The earlier seasons are television at its finest.',
        trailerUrl: 'https://www.youtube.com/watch?v=KPLWWIOCOOQ',
        numberOfSeasons: 8,
      },
      {
        title: 'The Wire',
        slug: 'the-wire',
        shortDescription:
          'A realistic portrayal of the drug scene, law enforcement, and institutions in Baltimore.',
        longDescription:
          'The Wire examines the city of Baltimore from multiple perspectives: police, drug dealers, politicians, and citizens. Each season focuses on a different institution while maintaining an overarching narrative. Praised for its depth and social commentary.',
        rating: 9.3,
        personalReview:
          'Demanding but rewarding. The most nuanced and intelligent crime drama ever made.',
        trailerUrl: 'https://www.youtube.com/watch?v=9qK-VGjMr8g',
        numberOfSeasons: 5,
      },
      {
        title: 'Stranger Things',
        slug: 'stranger-things',
        shortDescription:
          'In 1980s Indiana, a group of kids encounter supernatural forces and a mysterious girl with powers.',
        longDescription:
          'Stranger Things blends sci-fi, horror, and nostalgia as it follows the residents of Hawkins and their encounters with the Upside Down. The series pays homage to 80s pop culture while telling an original story of friendship and otherworldly danger.',
        rating: 8.7,
        personalReview: 'Nostalgic, fun, and full of heart. Perfect binge material.',
        trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
        numberOfSeasons: 4,
      },
      {
        title: 'The Crown',
        slug: 'the-crown',
        shortDescription:
          'A historical drama following the reign of Queen Elizabeth II and the British royal family.',
        longDescription:
          'The Crown chronicles the life of Queen Elizabeth II from her wedding in 1947 through decades of political and personal challenges. The cast rotates every two seasons to reflect the aging of characters. Known for its production quality and nuanced portrayal of recent history.',
        rating: 8.6,
        personalReview: 'Lavish and compelling. A fascinating look at duty, power, and family.',
        trailerUrl: 'https://www.youtube.com/watch?v=JWtnJjn6ng0',
        numberOfSeasons: 6,
      },
    ]

    const novelsData = [
      {
        title: '1984',
        slug: '1984',
        shortDescription:
          "George Orwell's dystopian novel about totalitarianism, surveillance, and the manipulation of truth.",
        longDescription:
          '1984 depicts a totalitarian society ruled by the Party and its leader Big Brother. Winston Smith works at the Ministry of Truth, altering historical records. His rebellion and doomed love affair with Julia explore themes of freedom, reality, and the power of language.',
        rating: 9.0,
        personalReview: 'As relevant today as when it was written. A must-read classic.',
        externalLink: 'https://www.goodreads.com/book/show/40961427-1984',
        numberOfChapters: 23,
      },
      {
        title: 'The Great Gatsby',
        slug: 'the-great-gatsby',
        shortDescription:
          "F. Scott Fitzgerald's tale of wealth, love, and the American Dream in the Jazz Age.",
        longDescription:
          'Narrated by Nick Carraway, the novel centers on the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan. Set in the summer of 1922 on Long Island, it explores decadence, idealism, and the emptiness of the wealthy elite.',
        rating: 8.5,
        personalReview: 'Beautiful prose and a haunting portrait of the Roaring Twenties.',
        externalLink: 'https://www.goodreads.com/book/show/4671.The_Great_Gatsby',
        numberOfChapters: 9,
      },
      {
        title: 'Dune',
        slug: 'dune',
        shortDescription:
          "Frank Herbert's science fiction epic about desert planet Arrakis, spice, and political intrigue.",
        longDescription:
          'Dune follows Paul Atreides as his family assumes control of the desert planet Arrakis, the only source of the valuable spice melange. Betrayal, ecology, religion, and destiny intertwine in a complex saga that has influenced generations of science fiction.',
        rating: 8.8,
        personalReview: 'Dense and immersive. The world-building is unmatched.',
        externalLink: 'https://www.goodreads.com/book/show/44767458-dune',
        numberOfChapters: 46,
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        slug: 'harry-potter-and-the-philosophers-stone',
        shortDescription:
          "J.K. Rowling's first book in the series: a young wizard discovers his destiny at Hogwarts.",
        longDescription:
          "Harry Potter learns on his eleventh birthday that he is a wizard. He leaves his miserable life with the Dursleys to attend Hogwarts School of Witchcraft and Wizardry, where he makes friends, learns magic, and uncovers the truth about his parents' death.",
        rating: 9.2,
        personalReview: 'A magical start to an unforgettable series. Perfect for all ages.',
        externalLink: 'https://www.goodreads.com/book/show/3.Harry_Potter_and_the_Sorcerer_s_Stone',
        numberOfChapters: 17,
      },
      {
        title: 'Pride and Prejudice',
        slug: 'pride-and-prejudice',
        shortDescription:
          "Jane Austen's beloved romance about Elizabeth Bennet and the proud Mr. Darcy.",
        longDescription:
          'Pride and Prejudice follows the Bennet family and the complicated relationship between the quick-witted Elizabeth and the wealthy, aloof Fitzwilliam Darcy. Through misunderstandings and social expectations, Austen crafts a sharp and enduring comedy of manners.',
        rating: 8.8,
        personalReview: 'Witty, romantic, and endlessly re-readable.',
        externalLink: 'https://www.goodreads.com/book/show/1885.Pride_and_Prejudice',
        numberOfChapters: 61,
      },
    ]

    for (const data of seriesData) {
      const existing = await Series.findBy('slug', data.slug)
      if (!existing) {
        await Series.create(data)
      }
    }

    for (const data of novelsData) {
      const existing = await Novel.findBy('slug', data.slug)
      if (!existing) {
        await Novel.create(data)
      }
    }
  }
}
