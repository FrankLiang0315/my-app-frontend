"use client"

const baseUrl = 'https://localhost:7009/api/';

export const SendGet = async (url: string, body?: any) => {
  let headers: HeadersInit | undefined = {
    'Content-Type': 'application/json',
  };
  
  const token  = localStorage.getItem('LoginToken');

  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  

  const response = await fetch(baseUrl + url, {
    method: "GET",
    headers: headers,
    body: JSON.stringify(body),
    mode: 'cors'
  });

  return await response?.json();
}

export const SendPost = async (url: string, body: any) => {
    let headers: HeadersInit | undefined = {
      'Content-Type': 'application/json',
    };
    
    const token  = localStorage.getItem('LoginToken');

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    

    const response = await fetch(baseUrl + url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      mode: 'cors'
    });

    try {
      return response.json()
    } 
    catch{
      return null;
    };
}


