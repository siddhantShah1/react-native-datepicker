import React,{useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Button, TextInput, ScrollView, ToastAndroid } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CalenderHeader from './components/calendarHeader'
import CalendarWeek from './components/calendarWeek'
import CalendarDates from './components/calendarDates'
import {calendarData} from './helpers/CalenderData'
import { calendarFunctions } from './helpers/secondaryHelpers'

import {
  _getCalendarInitialDetails,
  _renderNextMonthCalendar,
  _renderPreviousMonthCalendar
} from './helpers'


const DatePicker = ({
  dateFormat,
  onDateChange,
  placeholderText,
  selectedDefaultDate,
  fromDate, 
  toDate
}) => {

  const [calendarDetails, setCalendarDetails] = useState({
    bsYear: 0,
    bsMonth: 0,
    bsDate: 0,
    weekDay: 0,
    formattedDate: undefined,
    adDate: undefined,
    bsMonthFirstAdDate: undefined,
    bsMonthDays: undefined
    })
  
    const [selectedDate, setSelectedDate] = useState('')
    const [visible, setVisible] = useState(false)
    
    const [colourDate, setColourDate] = useState('grey')
    const [colourYear, setColourYear] = useState('grey')

    const [year, setYear] = useState('');
    const [month, setMonth] = useState(0);
    const [inpdate, setInpDate] = useState('');

    const [selectedDayMonth, setSelectedDay] = useState({
      day: -1,
      month: -1
    })

    const dateFormatted = '%D, %M %d, %y'
    const { bsMonth, bsYear, bsDate } = calendarDetails
  
    useEffect(() => {
      const details = _getCalendarInitialDetails(0, dateFormatted)
      setCalendarDetails(details)
      setSelectedDate(details.formattedDate)
    }, [])

    useEffect(() => {
      try {
        if (
          !!selectedDefaultDate &&
          calendarFunctions.isValidDate(selectedDefaultDate)
        ) {
          const updatedNepaliDate = selectedDefaultDate
            .split('-')
            .map((n) => calendarFunctions.getNepaliNumber(n))
            .join('-')
          setSelectedDate(updatedNepaliDate)
        }
      } catch (e) {}
    }, [selectedDefaultDate])

    const changeMonth = (type) => {
      let details = calendarDetails
      if (type === 'next') {
        details = _renderNextMonthCalendar(bsMonth, bsYear, bsDate, dateFormatted)
      }
      if (type === 'prev') {
        details = _renderPreviousMonthCalendar(
          bsMonth,
          bsYear,
          bsDate,
          dateFormatted
        )
      }
      setCalendarDetails(details)
    }
    
    const onDateClick = (day) => {
      const selectedDateDetails = calendarFunctions.getBsMonthInfoByBsDate(
        bsYear,
        bsMonth,
        day,
        dateFormatted
      )
      setSelectedDate(selectedDateDetails.formattedDate)
      //setVisible(false)
      setSelectedDay({
        day: day,
        month: bsMonth
      })
    } 

    const handleSubmit =() =>{
      
      if(inpdate.length < 1 || parseInt(inpdate) > 32){
        setColourDate('red')
        showToast('Invalid Date')
      }
      if(year.length < 4){
        setColourYear('red')
        showToast('Invalid Year')
      }

      if(year.length === 4){
        if(parseInt(year) >= calendarData.minBsYear && parseInt(year) <= calendarData.maxBsYear && parseInt(inpdate) > 0 && parseInt(inpdate) < 33){
          let tempDate = inpdate === '' ? 1 : parseInt(inpdate) 
        let temp = calendarFunctions.getBsMonthInfoByBsDate(
          parseInt(year), 
          parseInt(month)+1, 
          parseInt(tempDate), 
          dateFormatted)

          setSelectedDay({
            day: tempDate,
            month: parseInt(month)+1
          })
       setCalendarDetails(temp)
       handleReset()
       setSelectedDate(temp.formattedDate)
        }
        else{
          setColourYear('red')
          showToast('Limit Exceeded')
        }
      }
    }
    const showToast = (message) => {
      ToastAndroid.show(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    };

    const handleReset =(e)=>{
      setYear('')
      setInpDate('')
      setMonth(0)
      setColourDate('grey')
      setColourYear('grey')
      if(e){
        const details = _getCalendarInitialDetails(0, dateFormatted)
        setCalendarDetails(details)
        setSelectedDate(details.formattedDate)
        setSelectedDay({day: -1,
          month: -1})
      }
    }
    
    const selectedDay =
    selectedDayMonth.month === calendarDetails.bsMonth
      ? selectedDayMonth.day
      : undefined

  return bsYear == 0 ? (<></>) : (
    <View style={styles.container}>
      <View>
      <TouchableOpacity 
        onPress={()=>setVisible(!visible)}
        style={{width:'200%',alignItems:'center'}}>
        <Text
          readOnly={true}  
          style={{ borderColor: 'red', borderWidth: 2, color:'black', width:200, alignContent:'center'}}
        >{selectedDate}</Text>
        </TouchableOpacity>
        
        <Modal
          visible={visible}
          transparent={false}
          animationType='fade'        
          onRequestClose={() => {
            setVisible(!visible);
          }}
        >
        <ScrollView>
          <View>
          <View style={{flex:0.15,flexDirection: 'row', justifyContent:'flex-start'}}>
          <Button title='X' color='red' onPress={()=> setVisible(false)}/>
          </View>

          <View style={{flex:1, borderBottomWidth :2, borderBottomColor: 'grey'}}>
            <Text style={{color: 'black', alignSelf:'center',fontWeight:'bold', marginTop:30, marginBottom: 40}}>{selectedDate}</Text>
          <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
            <TextInput placeholder=' Enter Date...' 
              value={inpdate} 
              
              textAlign='center' 
              onChangeText={inpdate=>setInpDate(inpdate)} 
              maxLength={2} keyboardType='number-pad' underlineColorAndroid={colourDate}
              style={{width: 100, color:`${colourDate}`}}/>
            <Picker
              selectedValue={month}
              style={{ width: 120 }}
              onValueChange={(itemIndex) => setMonth(itemIndex)}
            >
            {calendarData.bsMonths.map((month, index)=>{
              return(
                <Picker.Item label={month} value={index} key={month} />
              )
            })}
            </Picker>
            <TextInput placeholder=' Enter Year...' 
              value={year} 
              textAlign='center' 
              onChangeText={year=>setYear(year)} 
              maxLength={4} 
              keyboardType='number-pad' underlineColorAndroid={colourYear}
              style={{width: 100, color:`${colourYear}`}}/>
          </View>
            <View  style={{flexDirection:'row', justifyContent:'space-around', marginTop:30, marginBottom:10}}>
            <Button title='Search ' onPress={handleSubmit}/>
            <Button title='Reset' onPress={handleReset}/>
            </View>
          </View>
          
          <View style={{flex:2, alignItems:'center'}}>
          <CalenderHeader {...{ bsMonth, bsYear, changeMonth }}/>
          <CalendarWeek />
          <CalendarDates {...{
                    calendarDetails,
                    onDateClick,
                    selectedDay,
                    fromDate,
                    toDate
                  }}/>
        </View>
        </View>
        <View style={{marginTop: 20, width:100, alignSelf:'center'}}>          
          <Button title='OK' onPress={()=> setVisible(false)}/>
        </View>
        </ScrollView>
        </Modal>
      </View>
    </View>
  );
}

export default DatePicker

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
