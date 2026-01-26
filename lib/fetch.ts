"use client";
import { toast } from "sonner";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("better-auth.session_token");
};

const getConfig = (): RequestInit => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

const getPostConfig = (): RequestInit => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: getToken() ? `Bearer ${getToken()}` : "",
  },
});

const getPostFormDataConfig = (): RequestInit => ({
  method: "POST",
  headers: {
    Authorization: getToken() ? `Bearer ${getToken()}` : "",
  },
});

//LOGIN
export const login = <T extends object>(content: T) => {
  return fetch("/api/login", {
    body: JSON.stringify(content),
    ...getPostConfig(),
  })
    .then((res) => res?.json())
    .catch((err) => console.log(err));
};

// Utilitaire: sérialise un objet params en query string
const buildParam = (param?: string | Record<string, unknown>) => {
  if (!param) return "";
  if (typeof param === "string")
    return param.startsWith("?") ? param : `?${param}`;
  const entries = Object.entries(param).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null) return acc;
      if (Array.isArray(value)) {
        // Répéter la clé pour les tableaux: key=a&key=b
        value.forEach(
          (v) =>
            (acc[key] = acc[key]
              ? `${acc[key]}&${key}=${encodeURIComponent(String(v))}`
              : String(v)),
        );
        return acc;
      }
      acc[key] = String(value);
      return acc;
    },
    {},
  );
  const qs = new URLSearchParams(entries).toString();
  return qs ? `?${qs}` : "";
};

// GET COLLECTION
export const getAll = async <T = any>(
  link: string,
  param?: string | Record<string, unknown>,
  customConfig?: RequestInit,
): Promise<T> => {
  const query = buildParam(param);

  return fetch(`/api/${link}${query}`, {
    ...getConfig(),
    ...customConfig,
  })
    .then((res) => res?.json())
    .then((res) => {
      if (res.detail) {
        toast.error(res.detail);
        throw new Error(res.detail);
      }
      return res as T;
    });
};

// GET ITEM :
export const getOne = async <T = any>(
  link: string,
  id: number | string,
  param?: string | Record<string, unknown>,
): Promise<T> => {
  const query = buildParam(param);
  return fetch(`/api/${link}/${id}${query}`, getConfig())
    .then((res) => res?.json())
    .catch((err) => console.log(err));
};

// GET BLOB
export const getBlob = async (endpoint: string) => {
  const currentToken = localStorage.getItem("token"); // Récupérer le token dynamiquement
  const response = await fetch(`/api/${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

// POST
export const post = <T extends object>(
  link: string,
  content: T,
  formData?: boolean,
) => {
  return fetch(`/api/${link}`, {
    body: formData ? (content as FormData) : JSON.stringify(content),
    ...(formData ? getPostFormDataConfig() : getPostConfig()),
  })
    .then((res) => res?.json())
    .then((res) => {
      if (res.error || res.detail) {
        toast.error(res.error || res.detail);
        throw new Error(res.error || res.detail);
      }
      return res;
    });
};

// PUT
export const editOne = <T extends object>(
  link: string,
  content: T,
  id?: number | string,
) => {
  return fetch(`/api/${link}${id ?? ""}`, {
    method: "PUT",
    body: JSON.stringify(content),
    ...getConfig(),
  })
    .then((res) => res?.json())
    .then((res) => {
      if (res.error) {
        toast.error(res.error);
      }
      return res;
    });
};

// PATCH
export const patch = <T extends object>(link: string, content: T) => {
  return fetch(`/api/${link}`, {
    method: "PATCH",
    body: JSON.stringify(content),
    ...getConfig(),
  })
    .then((res) => res?.json())
    .then((res) => {
      if (res.error) {
        toast.error(res.error);
      }
      return res;
    });
};

// DELETE
export const deleteOne = (link: string, id: number | string) => {
  return fetch(`/api/${link}${id}`, {
    method: "DELETE",
    ...getConfig(),
  })
    .then(async (res) => {
      if (!res) return null;
      // DELETE renvoie souvent 204 No Content → ne pas parser JSON
      if (res.status === 204) return { ok: true } as any;
      // Tenter de parser si un corps existe
      const text = await res.text();
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })
    .then((res: any) => {
      if (res && res.detail) {
        toast.error(res.detail);
        throw new Error(res.detail);
      }
      return res;
    });
};

export type ResType = {
  data: any;
  status: number;
  message: string;
};
