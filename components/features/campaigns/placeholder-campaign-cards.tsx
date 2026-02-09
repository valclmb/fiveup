"use client";

import { useState } from "react";
import { CampaignCard } from "./campaign-card";

/** Placeholder cards for upcoming campaigns. Generic state, no real logic. */
export function DelayedDeliveryCard() {
  const [isActive, setIsActive] = useState(false);
  return (
    <CampaignCard
      imageIndex={2}
      title="Delayed Delivery Message"
      allowConfigureWhenDisabled
      description="Automatically notify customers when a delivery is delayed, with a message you can fully customize."
      isActive={isActive}
      onSwitchChange={setIsActive}
      drawerTitle="Configure Delayed Delivery"
      drawerContent={
        <div className="space-y-6 text-sm text-muted-foreground">
          <p>Configure when and how to notify customers about delivery delays.</p>
          <ul className="list-disc space-y-2 pl-4">
            <li>Expected delivery window (e.g. 4–5 business days)</li>
            <li>Trigger day: Send on Day X after order (e.g. Day 6)</li>
            <li>Channel: WhatsApp / Email</li>
            <li>Message template with variables: {"{{first_name}}"}, {"{{order_number}}"}, {"{{tracking_link}}"}</li>
          </ul>
          <p className="text-xs">
            Use case: When delivery is supposed in 4–5 days, send a reassurance message on day 6.
          </p>
        </div>
      }
    />
  );
}

export function WhatsAppMarketingCard() {
  const [isActive, setIsActive] = useState(false);
  return (
    <CampaignCard
      imageIndex={3}
      title="WhatsApp Marketing Campaign"
      allowConfigureWhenDisabled
      description="Send a promotional WhatsApp message to selected customers with a configurable discount."
      isActive={isActive}
      onSwitchChange={setIsActive}
      drawerTitle="Configure WhatsApp Marketing"
      drawerContent={
        <div className="space-y-6 text-sm text-muted-foreground">
          <p>Promotion settings</p>
          <ul className="list-disc space-y-2 pl-4">
            <li>Promotion name / theme (e.g. Christmas Sale, Flash Sale)</li>
            <li>Discount value: percentage or fixed (10%, €10)</li>
            <li>Target: All customers / Only 2–5 stars</li>
            <li>Message template + CTA link</li>
            <li>Optional image / banner upload</li>
          </ul>
        </div>
      }
    />
  );
}

export function LongDeliveryReassuranceCard() {
  const [isActive, setIsActive] = useState(false);
  return (
    <CampaignCard
      imageIndex={4}
      title="Long Delivery Reassurance Flow"
      allowConfigureWhenDisabled
      description="A fully customizable multi-step reassurance flow to reduce anxiety for long shipping times."
      isActive={isActive}
      onSwitchChange={setIsActive}
      drawerTitle="Configure Long Delivery Flow"
      drawerContent={
        <div className="space-y-6 text-sm text-muted-foreground">
          <p>Multi-step flow for stores with long delivery times.</p>
          <ul className="list-disc space-y-2 pl-4">
            <li>Flow editor: Add / remove / reorder steps</li>
            <li>Step schedule: Day X after order per message</li>
            <li>Optional pre-written reassurance templates</li>
            <li>Channel per step: WhatsApp / Email</li>
          </ul>
          <p className="text-xs">
            Reduces support tickets and keeps customers informed during long shipments.
          </p>
        </div>
      }
    />
  );
}

export function LoyalCustomerCard() {
  const [isActive, setIsActive] = useState(false);
  return (
    <CampaignCard
      imageIndex={5}
      title="Loyal Customer Reward Campaign"
      allowConfigureWhenDisabled
      description="Reward recurring customers automatically based on your own rules (orders + timeline)."
      isActive={isActive}
      onSwitchChange={setIsActive}
      drawerTitle="Configure Loyal Customer Rewards"
      drawerContent={
        <div className="space-y-6 text-sm text-muted-foreground">
          <p>Eligibility and reward rules.</p>
          <ul className="list-disc space-y-2 pl-4">
            <li>Minimum orders (e.g. 3+)</li>
            <li>Time window (e.g. last 90 days)</li>
            <li>Reward frequency: every X months</li>
            <li>Reward type: discount code / % or fixed amount</li>
            <li>Message template + CTA link</li>
          </ul>
        </div>
      }
    />
  );
}
