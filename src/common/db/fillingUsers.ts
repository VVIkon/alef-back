import axios from "axios";

export const getRandomName= async () => {
  const url = 'https://api.randomdatatools.ru/?typeName=true&typeName=all&params=FirstName,LastName,FatherName,Email';
  const { data } = await axios<{FirstName: string, LastName:string, FatherName: string, Email: string}>(url);
  return data || '';
}
