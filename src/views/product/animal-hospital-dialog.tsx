"use client";

import { Button, Dialog, DialogContent, TextField, Zoom } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { TransitionDialog } from "@/compornets/transition-dialog";

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAP_KEY ?? "",
  version: "weekly",
});

type Props = { isOpen: boolean; setIsOpen: (value: boolean) => void };

export function AnimalHospitalDialog({ isOpen, setIsOpen }: Props) {
  const [map, setMap] = useState<google.maps.Map>();
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();
  const [searchText, setSearchText] = useState<string>("");
  // const [loadTimeOutId, setLoadTimeOutId] = useState<NodeJS.Timeout>();
  const [loadTimeOutIds, setLoadTimeOutIds] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (isOpen) {
      let newLoadTimeOutId = setInterval(load, 500);
      console.log(newLoadTimeOutId);

      // setLoadTimeOutId(newLoadTimeOutId);
      // 陣列能及時更新 原因未知
      let newLoadTimeOutIds = loadTimeOutIds;
      newLoadTimeOutIds.push(newLoadTimeOutId);
      setLoadTimeOutIds(newLoadTimeOutIds);
    }
  }, [isOpen]);

  const load = () => {
    // console.log('load', document.getElementById('map'), loadTimeOutId, loadTimeOutIds);
    console.log("load", document.getElementById("map"), loadTimeOutIds);
    if (
      document.getElementById("map") !== null &&
      loadTimeOutIds.length !== 0
    ) {
      loader.importLibrary("maps").then((maps) => {
        const map = new maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            center: { lat: 23.69781, lng: 120.96052 }, // 台灣的地理坐标
            zoom: 7, // 缩放级别
          }
        );
        setMap(map);
        const infoWindow = new maps.InfoWindow();
        setInfoWindow(infoWindow);

        loadTimeOutIds.forEach((i) => {
          clearInterval(i);
        });
        setLoadTimeOutIds([]);
      });
    }
  };
  const search = () => {
    loader.importLibrary("places").then((places) => {
      if (map !== undefined) {
        const service = new places.PlacesService(map);
        // 文字搜尋地點(place_id 地址)
        service.textSearch(
          { query: searchText + "動物醫院", bounds: map.getBounds() },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results !== null
            ) {
              const bounds = new google.maps.LatLngBounds();
              // 範圍繼承計數器
              let extendCount = 0;
              for (let i = 0; i < results.length; i++) {
                // 取得詳細資訊(電話 網址 等等)
                service.getDetails(
                  { placeId: results[i].place_id ?? "" },
                  (detailResults, status) => {
                    if (
                      status === google.maps.places.PlacesServiceStatus.OK &&
                      detailResults !== null &&
                      detailResults.geometry?.location !== undefined
                    ) {
                      // 建立圖標
                      createMarker(detailResults);
                      // 範圍添加座標
                      bounds.extend(detailResults.geometry?.location);
                      extendCount++;
                      // console.log(i, extendCount, results.length);
                      // console.log(detailResults);
                      // console.log(bounds.toJSON());
                      if (extendCount === results.length) {
                        console.log(bounds.toJSON());
                        map.fitBounds(bounds);
                      }
                    }
                  }
                );
              }
            }
          }
        );
      }
    });
  };

  function createMarker(place: google.maps.places.PlaceResult) {
    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry?.location,
    });

    const contentString = `<a href=${place.url} target="_blank"><b>${place.name}</b></a><br>${place.formatted_address}<br>${place.formatted_phone_number}`;

    google.maps.event.addListener(marker, "click", () => {
      infoWindow?.setContent(contentString);
      infoWindow?.open(map, marker);
    });
  }

  return (
    <TransitionDialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <div className="mb-4">
          <TextField
            label="您的所在地"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            sx={{ mr: 1 }}
          ></TextField>
          <Button onClick={search} variant="contained">
            搜尋
          </Button>
        </div>
        <div id="map" className=" w-full h-[500px]"></div>
      </DialogContent>
    </TransitionDialog>
  );
}
