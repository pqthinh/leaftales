export const list_book = [
  {
    id: 1, // Unique identifier for the book (replace with your actual property)
    title: "The Hitchhiker's Guide to the Galaxy",
    author: 'Douglas Adams',
    imageUrl: 'https://example.com/book1.jpg',
    description:
      'A humorous science fiction comedy series created by Douglas Adams.'
  },
  {
    id: 2,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    imageUrl: 'https://example.com/book2.jpg',
    description: 'A novel of manners by Jane Austen, first published in 1813.'
  },
  {
    id: 3,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    imageUrl: 'https://example.com/book3.jpg',
    description:
      'A coming-of-age novel written by Harper Lee published in 1960.'
  }
  // ... and so on for other books
]

export const book_detail = {
  cover:
    'https://m.media-amazon.com/images/I/71SBXQhBCYL._AC_UF894,1000_QL80_.jpg',
  title: 'title book',
  description: 'Day la sach',
  content: [
    {
      title: 'Chapter 1: The Beginning',
      sentences: [
        'Once upon a time, in a faraway land, there lived a young prince.',
        'He was known for his bravery and kindness to all creatures.',
        'Add more sentences for chapter 1 if needed',
        ...`Từ thời xa xưa cho đến ngày nay, dân tộc Việt Nam luôn coi trọng và tự hào với ngôn ngữ quốc gia của mình - tiếng Việt. Tiếng Việt không chỉ là một phương tiện truyền đạt thông tin mà còn là biểu tượng văn hóa, là bản sắc tinh tế của đất nước. Sự giàu có và đẹp đẽ của tiếng Việt không chỉ hiện diện trong các yếu tố cơ bản mà còn được thể hiện qua sự hài hòa về âm hưởng và thanh điệu.
  
          Tiếng Việt, trong mắt người Việt Nam, không chỉ là một công cụ giao tiếp mà còn là nguồn cảm hứng sáng tạo, là ngôn ngữ của tình cảm, tư tưởng, và truyền thống lâu dài. Với đặc điểm giàu chất nhạc, tiếng Việt có khả năng truyền tải những ý nghĩa sâu sắc, tình cảm phong phú của người Việt Nam.
          
          Qua thời gian, từ vựng trong tiếng Việt không ngừng phát triển và đa dạng, thể hiện sự tiến bộ và sáng tạo của cộng đồng. Ngữ pháp cũng trở nên uyển chuyển và chính xác hơn, giúp con người Việt Nam thể hiện ý nghĩa một cách sắc sảo và đa dạng.
          
          Chính vì vậy, trong thời đại ngày nay, con người Việt Nam càng cần biết giữ gìn và phát huy sự trong sáng, giàu đẹp của tiếng Việt. Qua việc trân trọng và bảo vệ ngôn ngữ quốc gia, chúng ta đồng thời bảo toàn và truyền đạt những giá trị văn hóa, truyền thống quý báu của dân tộc.`
          .split(`.`)
          .map(e => e.replace(/\\n/, '').trim() + '.')
      ]
    },
    {
      title: 'Chapter 2: The Adventure Begins',
      sentences: [
        'One day, the prince decided to embark on an adventure to explore the unknown.',
        'With his loyal horse by his side, he journeyed into the enchanted forest.',
        'Add more sentences for chapter 2 if needed'
      ]
    }
  ]
}
