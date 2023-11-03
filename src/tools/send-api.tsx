"use client";

const baseUrl = process.env.BACK_END_URL + "/api/";

export const SendGet = async (url: string, body?: any) => {
  let headers: HeadersInit | undefined = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("LoginToken");

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const response = await fetch(baseUrl + url, {
    method: "GET",
    headers: headers,
    body: JSON.stringify(body),
    mode: "cors",
  });

  try {
    if (response.ok) {
      return response.json();
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const SendPost = async (url: string, body: any) => {
  let headers: HeadersInit | undefined = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("LoginToken");

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const response = await fetch(baseUrl + url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
    mode: "cors",
  });

  try {
    if (response.ok) {
      return response.json();
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
