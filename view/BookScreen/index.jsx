import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native'
import * as Speech from 'expo-speech'
import Slider from '@react-native-community/slider'
import { Picker } from '@react-native-picker/picker'

const BookScreen = () => {
  const [unread, setUnread] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [pitch, setPitch] = useState(1.0)
  const [rate, setRate] = useState(1.0)
  const [language, setLanguage] = useState('vi')
  const [voice, setVoice] = useState('male')
  const [sentences, setSentences] = useState([])
  const [currentSentence, setCurrentSentence] = useState(0)
  const [read, setRead] = useState([])
  // const [text, setText] = useState()

  useEffect(() => {
    const data = `Tắt đèn

    Bắt đầu từ gà gáy một tiếng, trâu bò lục-tục kéo thợ cầy đến đoạn đường phía trong điếm tuần.
    
    Mọi ngày, giờ ấy, những con-vật này cũng như những người cổ cầy, vai bừa kia, đã lần-lượt đi mò ra ruộng làm việc cho chủ. Hôm nay, vì cổng làng chưa mở, chúng phải chia quãng đứng rải-rác ở hai vệ đường, giống như một lũ phu vờ chờ đón những ông quan lớn.
    
    Dưới bóng tối của rặng tre um-tùm, tiếng trâu thở hì-hò, tiếng bò đập đuôi đen-đét, sen với tiếng người khạc khúng-khắng.
    
    Cảnh-tượng điếm tuần thình-lình hiện ra trong ánh lửa lập-lòe của chiếc mồi rơm bị thổi. Cạnh giẫy sào, giáo ngả nghiêng dựng ở giáp tường, một lũ tuần-phu lố-nhố ngồi trên lớp chiếu quằn-quèo. Có người phì-phò thổi mồi. Có người ve-ve mồi thuốc và chìa tay chờ đón điếu đóm. Có người há miệng ngáp dài. Có người đang hai tay dụi mắt. Cũng có người gối đầu trên cái miệng hiệu sừng trâu, ngảnh mặt vào vách mà ngáy.
    
    Cái điếu cày và cái đóm lửa bị năm, sáu người chuyền tay, chiếu đi, chiếu lại độ vài ba vòng, ánh lửa lại tắt, trong điếm chỉ còn tiếng nói chuyện rầm-rầm.
    
    Gà gáy giục. Trời sáng mờ-mờ.
    
    Trâu bò, con đứng, con nằm, thi nhau quai hai hàm răng nhai trầu xuông và nhả ra những cục nước bọt to bằng cái trứng.
    
    Thợ cầy khắp lượt dùng bắp cầy, vai cầy làm ghế ngồi, cùng nhau bàn tán băng-cua về chuyện sưu thuế.
    
    Những con chèo-bẻo chẽo-choẹt hót trên ngọn tre, như muốn họa lại khúc ca réo-rắt - mà người quê vẫn gọi là khúc "váy cô, cô cởi" - của mấy con chào-mào đậu trên cành xoan, đon-đả chào vẻ tươi đẹp của cảnh trời buổi sáng.
    
    Toang cổng vẫn đóng chặt. Tuần-phu lại lần lượt thổi mồi hút thuốc lào.
    
    - Ông Trương ơi, ông làm ơn mở cổng cho tôi đánh trâu ra đồng ạ. Mọi ngày bây giờ tôi đã cầy được ba sào ruộng rồi. Hôm nay, bây giờ còn nhong-nhóng ở đây... Phỏng chừng từ giờ đến trưa, cầy sao cho xong cái ruộng mẫu hai? Thôi ông làm phúc, làm đức...
    
    Sau tiếng năn-nỉ của anh chàng cục-mịch, vai vác cầy, tay cầm thừng trâu, trương-tuần quẳng cái điếu cầy xuống đất, thở nốt khói thuốc trong miệng, rồi giương đôi mắt say thuốc lờ-đờ:
    
    - Nay chẳng xong thì mai! Ông Lý đã bảo thuế còn thiếu nhiều, không cho một con trâu, con bò nào ra đồng hết thảy...
    
    - Thưa ông, ông chủ tôi nóng tính lắm kia! Ông ấy đã dặn buổi nay tôi phải cầy cho xong ruộng ấy, nếu không xong, đến trưa về ăn cơm, ông ấy mắng như tát nước và nói như móc cơm ra... Chớ tôi có muốn vất-vả vào mình làm gì? Vả lại, ông Lý sai tuần đóng cổng, cốt để bắt trâu, bắt bò của người thiếu thuế kia chứ! Ông chủ tôi nộp thuế đủ từ hôm qua rồi, xin ông mở cổng cho tôi...!
    
    Trương-tuần nhăn mặt:
    
    - Tôi không phải tộc-biểu, không phải phần thu, biết điếc gì đâu ông chủ anh nộp thuế rồi hay chưa nộp. Bây giờ mở cổng cho anh, chốc nữa ông Lý ông ấy chửi cha tôi lên, anh có-nghe hộ tôi không?
    
    Anh chàng cục-mịch lủi-thủi đánh trâu gồng cầy lùi xuống, để nhường khu đất trước điếm cho người khác vác bừa và đuổi trâu lên.
    
    - Người ta trâu của nhà, ông chẳng cho ra thì chớ. Ðây tôi, trâu thuê... đồng hai một buổi đáp, ông ạ. Xin ông lượng tình mà ngỏ cổng cho tôi ra đồng kẻo trưa quá mất rồi.
    
    Người ấy nói tuy thiết-tha, trương-tuần chỉ đáp lại bằng cái lắc đầu:
    
    - Nếu trưa quá thì bừa luôn đến chiều. Trâu thuê sợ gì!
    
    - Thế được thì còn gì nói truyện gì nữa! Của một đống tiền, ai để cho mình ốp nó đến chiều? Chỉ đến non trưa, ông chủ có trâu cho thuê đã ra tận ruộng tháo vai trâu mà dắt trâu về, muốn bừa thêm một nửa đường nữa cũng không cho, ông ạ. Thôi! Mùa làm ăn, ông nghĩ lại...!
    
    - Tôi chẳng nghĩ lại, nghĩ đi gì cả! Bố tôi sống lại, bảo tôi mở cổng này bây giờ, tôi cũng xin chịu đừng nói anh...
    
    Người ấy lại vác bừa, đưa trâu trở lại chỗ cũ với cái sắc mặt thìu-thịu.
    
    Mặt trời ngấp nghé mặt lũy, muốn nhòm vào điếm. Tuần-phiên lẻ-tẻ vác sào, cắp chiếu, đeo hiệu đi về. Trong điếm chỉ còn trương-tuần duỗi gối kiểu gọng bừa, ngồi trên chiếc chiếu điểm những tro mồi, bã điếu, đốc suất mấy tên đàn em ở lại canh ngày.
    
    Xa xa nẻo trong đình, một hồi mõ cá thật dài, tiếp luôn đến trống ngũ-liên nện đủ ba hồi chín tiếng.
    
    Như có vẻ kinh ngạc về những thứ hiệu lệnh dữ dội, mấy con trâu bò đanh nằm còng queo trên đường, đồng thời lóp-ngóp đứng dậy.
    
    - Mẹ cha chúng nó! Hôm nay vẫn chưa đóng thuế, chúng nó định để tội vạ cho ai? Ðược! Cứ bướng đi, ông mà bắt hết trâu bò bán ráo!...
    
    Tiếng chửi om-sòm như giục mấy chục cặp mắt ngơ-ngẩn của bọn cầy đều phải nghiêng về phía đình. Ông lý nách cắp cuốn sổ, một tay cầm cây gậy song, một tay xếch đôi ống quần móng lợn, vừa đi vừa ra phía điếm tuần vừa thét mắng những người chậm thuế.
    
    Ðã năm hôm nay, nghĩa là sau khi bài-bổ trình phủ đã giao về với một chữ "y", Lý-trưởng Ðông-xá ngày nào cũng vất-vả về thuế.
    
    Ðầu tiên hắn còn cho mõ đi rao. Rồi đến tộc-biểu, phần thu đi hỏi. Rồi đến đầy-tớ của hắn đưa đầy-tớ chánh-tổng đi thúc từng người. Trong năm ngày nay, ngày nào cũng vậy, mõ cá, trống thúc liên hồi, hiệu ốc, hiệu sừng thổi inh-ỏi. Suốt từ sáng sớm cho tới tối mịt, trong làng lúc nào cũng như đám đánh cướp. Bây giờ đã gần đến ngày đổ thuế, công việc càng gấp. Hôm qua hắn đã lên phủ, xin với ông phủ phái cho một người cai lệ và hai người lính cơ về làng để trừng-trị những kẻ bướng-bỉnh.
    
    Nhờ có cái thần-thế ấy, hắn mới chửi rỡ, thét mắng khắp làng cho oai.
    
    Thợ cầy và tuần-phu đều biết cái hách- dịch của ông Lý, ai nấy chỉ đáp lại những câu chửi chùm chửi lợp bằng sự nín im.
    
    Trâu, bò nhiều con vẫy tai như muốn chào một người chức-việc chăm-chỉ phận-sự trong khi người ấy qua trước mặt chúng.
    
    Bước lên sàn điếm, Lý-trưởng quăng tạch cuốn sổ xuống sàn, giơ tay chỉ vào mặt mấy tên đàn em:
    
    - Hiệu không thổi, để làm sỏ bố chúng bay à?
    
    Một hồi còi tu-tu đồng thời nổi lên, hiệu sừng sen với hiệu ốc theo đúng hiệu ốc cố theo đúng mệnh của "nhất lý chi trưởng".
    
    Ðập hai bàn chân vào nhau, rũ cho sạch bụi, rồi co chân lên ngồi vào chiếu, Lý-trưởng vớ luôn lấy chiếu điếu cầy và sai tuần-phủ lấy đóm, thổi lửa.
    
    Mấy anh thợ cày của những điền-chủ đã nộp đủ thuế, bạo-dạn tiến đến trước mặt ông Lý:
    
    - Thưa ông, trưa lắm rồi! Xin ông cho tuần mở cổng để chúng tôi đánh trâu đi cầy!...
    
    - Thong thả! Hãy đứng đấy! Cầy đã nóng bằng thuế của nhà nước à?
    
    Vừa nói, Lý-trưởng vừa giặt mồi thuốc vào điếu, hút luôn một sạp ba điếu. Khói thuốc theo hai lỗ mũi tuôn ra như hai ngà voi. Lý-trưởng dõng-dạc:
    
    - Trương-tuần, anh bảo nó mở cổng ra. Nhà nào đủ thuế thì cho trâu bò ra đồng. Còn nhà nào thiếu thì bắt trâu bò điệu cả về đình cho tôi, để tôi liệu cho chúng nó!
    
    Sau một tiếng dạ của Trương-tuần, mấy tên đàn em loay-hoay tháo nêm, rút then cổng. Rồi cùng đứng doãi chân chèo, cố lấy hết sức của lực điền, xuống gạch vì cối cổng đã mòn nhiều quá. Lý trưởng đứng lên mở sổ sướng tên những người đủ thuế cho Trương-tuần nghe. Ước chừng mươi con trâu bò được đi với bọn thợ cầy cùng ra ngoài cổng. Còn độ hai chục con nữa đều phải vâng lệnh ông Lý, theo gót Trương-tuần và tuần-phu lũ-lượt kéo vài sân đình, chờ khi phải chịu tội thay cho chủ.`

    const sentences = data.split('\n')
    setSentences(sentences)
    setUnread(sentences)
    return () => {
      stopSpeech()
    }
  }, [])

  // useEffect(() => {
  //   setText(read.join('\n')+unread.join())
  // }, [read, unread, currentSentence])

  const startSpeech = async () => {
    try {
      setIsPlaying(true)
      setCurrentSentence(0)
      for (const sentence of sentences) {
        
        let temp = [...read]
        temp.push(currentSentence)
        setRead(temp)
        Speech.speak(sentence, {
          pitch: pitch,
          rate: rate,
          language: language,
          voice: voice,
          onWordStart: event => {
            console.log('Word started:', event.word)
          },
          onFinished: async event => {
            console.log('Speech finished:', event.cause)
            await new Promise(resolve => setTimeout(resolve, 500))
            setUnread(unread.slice(1))
            setIsPlaying(false)
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const pauseSpeech = async () => {
    if (Platform.OS === 'android') {
      console.log('Pause is not supported on Android.')
      return
    }

    try {
      await Speech.pause()
      setIsPlaying(false)
    } catch (error) {
      console.error(error)
    }
  }

  const resumeSpeech = async () => {
    try {
      if (currentSentence < sentences.length) {
        
        Speech.speak(sentences[currentSentence], {
          pitch: pitch,
          rate: rate,
          language: language,
          voice: voice,
          onWordStart: event => {
            // Do something when a word starts being spoken
            console.log('Word started:', event.word)
          },
          onFinished: event => {
            // Do something when speaking finishes
            console.log('Speech finished:', event.cause)
            setUnread(unread.slice(1))
            setRead(read.push(currentSentence))
          }
        })
        setCurrentSentence(currentSentence + 1)
      } else {
        setIsPlaying(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const stopSpeech = async () => {
    try {
      Speech.stop()
      setIsPlaying(false)
      setCurrentSentence(0)
    } catch (error) {
      console.error(error)
    }
  }
  const renderContent = useCallback(() => {
    return (
      <>
        <Text style={styles.read}>{read.length ? read.join('\n') : ''}</Text>
        <Text style={styles.unread}>
          {unread.length ? unread.join('\n') : ''}
        </Text>
      </>
    )
  }, [unread, read, currentSentence])

  return (
    <View style={styles.pContainer}>
      <ScrollView style={styles.content}>
        {/* <Text style={styles.read}>{read.length? read.join('\n'): ""}</Text>
        <Text style={styles.unread}>{unread.length? unread.join('\n'): ""}</Text> */}
        {renderContent()}
      </ScrollView>

      <ScrollView style={styles.control}>
        <View style={styles.childContainer}>
          <Button title='Bắt đầu' onPress={startSpeech} disabled={isPlaying} />
          <Button
            title='Tạm dừng'
            onPress={pauseSpeech}
            disabled={!isPlaying}
          />
          <Button
            title='Tiếp tục'
            onPress={resumeSpeech}
            disabled={!isPlaying}
          />
          <Button title='Dừng' onPress={stopSpeech} />
        </View>

        <View style={styles.childContainer}>
          <Text>Âm lượng:</Text>
          <Slider
            value={pitch}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            onValueChange={setPitch}
            style={styles.slide}
          />
        </View>

        <View style={styles.childContainer}>
          <Text>Tốc độ:</Text>
          <Slider
            value={rate}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            onValueChange={setRate}
            style={styles.slide}
          />
        </View>

        <View style={styles.childContainer}>
          <Text>Ngôn ngữ:</Text>
          <Picker
            selectedValue={language}
            onValueChange={itemValue => setLanguage(itemValue)}
            style={styles.slide}
          >
            <Picker.Item label='Tiếng Việt' value='vi' />
            <Picker.Item label='Tiếng Anh' value='en' />
          </Picker>
        </View>

        <View style={styles.childContainer}>
          <Text>Giọng đọc:</Text>
          <Picker
            selectedValue={voice}
            onValueChange={itemValue => setVoice(itemValue)}
            style={styles.slide}
          >
            <Picker.Item label='Nam' value='male' />
            <Picker.Item label='Nữ' value='female' />
          </Picker>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  pContainer: {
    marginTop: 40,
    width: '100%'
  },
  childContainer: {
    width: '100%'
  },
  slide: {
    width: '100%',
    paddingHorizontal: 10
  },
  read: {
    color: 'green'
  },
  unread: {},
  control: { height: '40%' },
  content: { height: '60%' }
})

export default BookScreen
