import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Alert, Linking } from 'react-native'
import { size } from 'lodash'

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

export const loadImageFromGallery = async(array) => {
    const response = { status: false, image: null }
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)
    if (resultPermissions.status === "denied") {
        Alert.alert("Debes de darle permiso para accerder a las imágenes del teléfono.")
        return response
    }   
    const result = await ImagePicker.launchImageLibraryAsync({      
        allowsEditing: true,
        aspect: array
    })
    if (result.cancelled) {
        return response
    }
    response.status = true
    response.image = result.uri
    return response
}

export const fileToBlob = async(path) => {
    const file = await fetch(path)
    const blob = await file.blob()
    return blob
}

export const getCurrentLocation = async() => {
    const response = { status: false, location: null }
    const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
    if (resultPermissions.status === "denied") {
        Alert.alert("Debes dar permisos para la localización.")
        return response
    }
    const position = await Location.getCurrentPositionAsync({})
    const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    }
    response.status = true
    response.location = location
    return response
}

export const formatPhone = (callingCode, phone) => {
    if (size(phone) < 10)
    {
        return `+(${callingCode}) ${phone}`
    }
    return `+(${callingCode}) ${phone.substr(0, 3)} ${phone.substr(3, 3)} ${phone.substr(6, 4)}`
}

export const callNumber = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`)
}

export const sendWhatsApp = (phoneNumber, text) => {
    const link = `https://wa.me/${phoneNumber}?text=${text}`
    Linking.canOpenURL(link).then((supported) => {
        if (!supported) {
            Alert.alert("Por favor instale WhatsApp para enviar un mensaje directo")
            return
        }
        return Linking.openURL(link)
    })
}

export const sendEmail = (to, subject, body) => {
    Linking.openURL(`mailto:${to}?subject=${subject}&body=${body}`)
}   