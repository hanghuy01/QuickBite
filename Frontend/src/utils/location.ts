import * as Location from "expo-location";
// import { Linking } from "react-native";

const LOC = {
  latC1: 10.804208,
  lonC1: 106.64542,
  addressC1: "37 C1, Tân Bình, Hồ Chí Minh",
  latBinhThanh: 10.793769,
  lonBinhThanh: 106.719565,
  addressBinhThanh: "180/77 Nguyễn Hữu Cảnh, Bình Thạnh, Hồ Chí Minh",
};

export async function getUserLocation() {
  // Xin quyền
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }

  // Lấy tọa độ hiện tại
  // const location = await Location.getCurrentPositionAsync({});
  // console.log("location:", location.coords.latitude, location.coords.longitude);

  // reverse geocode ra địa chỉ
  // const [addr] = await Location.reverseGeocodeAsync({
  //   latitude: location.coords.latitude,
  //   longitude: location.coords.longitude,
  // });

  return {
    // lat: location.coords.latitude,
    // lon: location.coords.longitude,
    // address: `${addr.formattedAddress}`,
    lat: LOC.latBinhThanh,
    lon: LOC.lonBinhThanh,
    address: LOC.addressBinhThanh,
  };
}
