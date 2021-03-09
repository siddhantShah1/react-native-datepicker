import React,{useState, useEffect } from 'react';
import {Picker} from '@react-native-picker/picker';
import CalenderHeader from './components/calendarHeader'
import CalendarWeek from './components/calendarWeek'
import CalendarDates from './components/calendarDates'
import {calendarData} from './helpers/CalenderData'
import { calendarFunctions } from './helpers/secondaryHelpers'
import PropTypes from 'prop-types'

import { 
  View, Text, 
  Modal, TouchableOpacity, TextInput, Button,
  ScrollView, ToastAndroid, useWindowDimensions,
  Pressable} from 'react-native';

import {
  _getCalendarInitialDetails,
  _renderNextMonthCalendar,
  _renderPreviousMonthCalendar
} from './helpers'

const DatePicker = ({
  dateFormat,
  onDateChange,
  selectedDefaultDate,
  fromDate, 
  toDate,
  edit
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
    
    const window = useWindowDimensions();
    const [editor] = useState(edit || false);

    const [selectedDate, setSelectedDate] = useState('')

    const [visible, setVisible] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [year, setYear] = useState('');
    const [month, setMonth] = useState(0);
    const [inpdate, setInpDate] = useState('');

    const [selectedDayMonth, setSelectedDay] = useState({
      day: -1,
      month: -1,
      year: -1
    })

    const [errorCss, setErrorCss] = useState({
      colourDate:'grey',
      colourYear:'grey'
    })

    const [displayDate, setDisplayDate] = useState({
      disDay:'',
      disDate:'',
      disMonth:'',
      disYear:''
    })

    

    const dateFormatted = '%y-%m-%d'
    const { bsMonth, bsYear, bsDate } = calendarDetails
  
    useEffect(() => {
      const details = _getCalendarInitialDetails(0, dateFormatted)

      setCalendarDetails(details)
      setSelectedDate(details.formattedDate)
    }, [])

    useEffect(()=>{
      if(!!selectedDate){
        const updDisplayDate = selectedDate
        .split('-')
        .map((n)=>calendarFunctions.getNumberByNepaliNumber(n))
        
        let objDate = calendarFunctions.getBsMonthInfoByBsDate(
          parseInt(updDisplayDate[0]),parseInt(updDisplayDate[1]), parseInt(updDisplayDate[2]), '%D,%M,%d,%y'
        )
        let tempDate = objDate.formattedDate.split(',')
        setDisplayDate({
          disDay: tempDate[0],
          disDate:tempDate[2],
          disMonth:tempDate[1],
          disYear: tempDate[3]
        })
        
      }
    },[selectedDate])

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

          let splitDefault = selectedDefaultDate.split('-') 
          let defaultObj = calendarFunctions.getBsMonthInfoByBsDate(
            parseInt(splitDefault[0]), 
            parseInt(splitDefault[1]), 
            parseInt(splitDefault[2]), 
            dateFormatted)
            setSelectedDay({
              day: parseInt(splitDefault[2]),
              month: parseInt(splitDefault[1]),
              year: parseInt(splitDefault[0])
            })
          setCalendarDetails(defaultObj)

          try {
            const objDate = calendarFunctions.getBsMonthInfoByBsDate(
              parseInt(splitDefault[0]), 
              parseInt(splitDefault[1]), 
              parseInt(splitDefault[2]), 
              dateFormat)
            onDateChange(objDate)
          } catch (error) {}

            return
          }

          if(!!fromDate && calendarFunctions.isValidDate(fromDate)){
            const updatedNepaliDate = fromDate
            .split('-')
            .map((n) => calendarFunctions.getNepaliNumber(n))
            .join('-')
          setSelectedDate(updatedNepaliDate)


          let splitDefault = fromDate.split('-')

          let defaultObj = calendarFunctions.getBsMonthInfoByBsDate(
            parseInt(splitDefault[0]), 
            parseInt(splitDefault[1]), 
            parseInt(splitDefault[2]), 
            dateFormatted)

            setSelectedDay({
              day: parseInt(splitDefault[2]),
              month: parseInt(splitDefault[1]),
              year: parseInt(splitDefault[0])
            })
          setCalendarDetails(defaultObj)

          try {
            const objDate = calendarFunctions.getBsMonthInfoByBsDate(
              parseInt(splitDefault[0]), 
              parseInt(splitDefault[1]), 
              parseInt(splitDefault[2]), 
              dateFormat)
            onDateChange(objDate)
          } catch (error) {}
            return
          }
        }
       catch (e) {}
    }, [selectedDefaultDate, fromDate])

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
      
    try {
      const objDate = calendarFunctions.getBsMonthInfoByBsDate(
        bsYear,
        bsMonth,
        day,
        dateFormat
      )
      onDateChange(objDate)
    } catch (error) {}

    setVisible(false)
    setSelectedDay({
      day: day,
      month: bsMonth,
      year: bsYear
    })
  } 

  const handleSubmit =() =>{
    if(year.length < 4){
      setErrorCss({
        colourYear:'red',
        colourDate:'grey'
      })
      showToast('Invalid Year')
      return
    }

    if(inpdate.length < 1 || parseInt(inpdate) > 32 || parseInt(inpdate) <1){
      setErrorCss({
        colourDate:'red',
        colourYear:'grey'
      })
      showToast('Invalid Date')
      return
    }

    if(year.length === 4){
      if(parseInt(year) >= calendarData.minBsYear && parseInt(year) <= calendarData.maxBsYear && parseInt(inpdate) > 0 && parseInt(inpdate) < 33){
        setErrorCss({
          colourYear:'grey',
          colourDate:'grey'
        })
        let tempDate = inpdate === '' ? 1 : parseInt(inpdate) 
        let temp = calendarFunctions.getBsMonthInfoByBsDate(
        parseInt(year), 
        parseInt(month)+1, 
        parseInt(tempDate), 
        dateFormatted)

        setSelectedDay({
          day: tempDate,
          month: parseInt(month)+1,
          year: parseInt(year)
        })
        setCalendarDetails(temp)
        setSelectedDate(temp.formattedDate)
        try {
          const objDate = calendarFunctions.getBsMonthInfoByBsDate(
            parseInt(year), 
            parseInt(month)+1, 
            parseInt(tempDate), 
            dateFormat
          )
          onDateChange(objDate)
        } catch (error) {}

        setEditModal(false)
      }

      else{
        setErrorCss({colourYear:'red', colourDate:'red'})
        showToast('Invalid Input')
        return
      }
    }
  }

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  };

  const selectedDay =
  selectedDayMonth.month === calendarDetails.bsMonth && selectedDayMonth.year === calendarDetails.bsYear
    ? selectedDayMonth.day
    : undefined

  return bsYear == 0 ? (<></>) : (
    <>
    <View>
      
        <TouchableOpacity style={{borderBottomColor:'grey',borderBottomWidth:1, width:window.width*0.2}} onPress={()=>setVisible(!visible)}>
          <Text 
            readOnly={true}  
            style={{color:'black', alignSelf:'center'}}
          >{selectedDate}</Text>
        </TouchableOpacity>
        
      {visible?
        
          <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
            onRequestClose={() => {
              setVisible(!visible)}}>

            <Pressable onPress={()=>{setVisible(!visible)}} style={{width:window.width, height:window.height, backgroundColor:'rgba(0, 0, 0, .8)', justifyContent:'center'}}>
            {editModal ? 
            <View style={{position:'relative',bottom:20,elevation:10, alignSelf:'center' }}>
            <Pressable onPress={f=>f}> 
            <View style={{flexDirection:'column',width:window.width*0.9,height:window.height*0.15,borderColor:'#2196F3',borderRadius:20, borderWidth:2, backgroundColor:'white', justifyContent:'center', alignSelf:'center'}}>
               <View style={{flexDirection:'row',justifyContent:'space-around', marginBottom:5}}>
               <TextInput placeholder=' Enter Year...' 
                   value={year} 
                   textAlign='center' 
                   onChangeText={year=>setYear(year)} 
                   maxLength={4} 
                   keyboardType='number-pad'
                   underlineColorAndroid={errorCss.colourYear}
                   style={{width: 100,fontWeight:'bold', color:`${errorCss.colourYear}`}}/>
                 
                 <Picker
                   selectedValue={month}
                   mode={'dropdown'}
                   style={{ width: 120,fontWeight:'bold', textAlign:'center' }}
                   onValueChange={(itemIndex) => setMonth(itemIndex)}>
                   {calendarData.bsMonths.map((month, index)=>{
                     return(
                       <Picker.Item label={month} value={index} key={month} />
                     )
                   })}
                 </Picker>
                 <TextInput placeholder=' Enter Date...' 
                   value={inpdate} 
                   textAlign='center' 
                   onChangeText={inpdate=>setInpDate(inpdate)} 
                   maxLength={2} keyboardType='number-pad'
                   underlineColorAndroid={errorCss.colourDate}
                   style={{width: 100,fontWeight:'bold', color:`${errorCss.colourDate}`}}/>
               </View>
               <View style={{alignItems:'center'}}>
               <TouchableOpacity style={{borderColor:'#2196F3',backgroundColor:'#2196F3',width:'30%',borderRadius:20, alignItems:'center',justifyContent:'center', borderWidth:2}} onPress={handleSubmit}><Text style={{color:'white'}}>OK</Text></TouchableOpacity>
               </View>
              </View>
              </Pressable>
              </View>
              :
              <></>
              }
              
            <View style={{width:window.width *0.9, 
              height: window.height*0.58 , alignSelf:'center',
              borderColor:'#2196F3',borderRadius:20, borderWidth:2, 
              backgroundColor:'white', 
              elevation:10
              }}>
              <Pressable onPress={f=>f}>         
              <ScrollView>
              <View style={{flex:1,flexDirection:'column', margin:15, borderBottomWidth:2, alignItems:'center'}}>
                  <Text style={{fontSize:20, fontWeight:'bold'}}>{displayDate.disYear}</Text>
                <View style={{ flexDirection:'row'}}>
                  <Text style={{fontSize:30, fontWeight:'bold'}}>{displayDate.disDay}, </Text>
                  <Text style={{fontSize:30, fontWeight:'bold'}}>{displayDate.disMonth} </Text>
                  <Text style={{fontSize:30, fontWeight:'bold'}}>{displayDate.disDate}</Text>
                </View>
              </View> 
              {editor ? 
              <View style={{alignItems:'center'}}>
                <TouchableOpacity style={{backgroundColor:`${editModal?'red':'#2196F3'}`, padding:7, elevation:7}} onPress={()=>setEditModal(!editModal)}><Text style={{fontWeight:'bold', color:'white'}}>{editModal? 'Close':'Edit'} </Text></TouchableOpacity>
              </View>             
              :
              <></>
            }                        
        <View style={{flex:1, alignItems:'center'}}>
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
            </ScrollView>
            </Pressable>
          </View>
          </Pressable>
        </Modal>
      :
    <></>}
  </View>
    </>
  );
}

DatePicker.prototype={
  dateFormat: PropTypes.string,
  onDateChange : PropTypes.func,
  selectedDefaultDate: PropTypes.string,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  edit: PropTypes.bool
}

export default DatePicker

