import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface InvitationMailProps {
  username?: string;
  userImage?: string;
  userRole?: string;
  invitedByEmail?: string;
  inviteLink?: string;
  ipAddress?: string;
  location?: string;
}

export const InvitationMail = ({
  username,
  userImage,
  userRole,
  invitedByEmail,
  inviteLink,
  ipAddress,
  location,
}: InvitationMailProps) => {
  const previewText = "Invitation to join our team on Orion";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={"https://utfs.io/f/31073a3a-15a6-4325-9dd1-fa8ecc05257a-1r46yt.png"}
                width="40"
                height="40"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join our team now on <strong>Orion</strong>.
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              {" "}has invited you to join our team on{" "}
              <strong>Orion</strong> as a <strong>{userRole}</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={userImage ?? "https://utfs.io/f/5de801e3-2397-4b3a-9be3-08a53e3ddbb9-lwrhgx.png"}
                    width="48"
                    height="48"
                  />                
                  </Column>
                <Column align="center">
                  <Img
                    className="rounded-full"
                    src={"https://utfs.io/f/f447f4f5-1340-4428-a618-228d6793f4bf-p8f5jp.png"}
                    width="12"
                    height="9"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={"https://utfs.io/f/31073a3a-15a6-4325-9dd1-fa8ecc05257a-1r46yt.png"}
                    width="48"
                    height="48"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="text-black">{username}</span>. This invite was
              sent from <span className="text-black">{ipAddress}</span>{" "}
              located in{" "}
              <span className="text-black">{location}</span>. If you
              were not expecting this invitation, you can ignore this email. If
              you are concerned about your account&apos;s safety, please reply to
              this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvitationMail;
