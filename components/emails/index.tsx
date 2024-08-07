import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
	name: string;
	url: string;
}

export const EmailTemplate = ({
	name = "Unknown user",
	url
}: EmailTemplateProps) => (
	<Html>
		<Head />
		<Preview>
			Orion Reset Password.
		</Preview>
		<Body style={main}>
			<Container style={container}>
				<Img
					src={'https://utfs.io/f/31073a3a-15a6-4325-9dd1-fa8ecc05257a-1r46yt.png'}
					width="50"
					height="50"
					alt="Orion"
					style={logo}
				/>
				<Text style={paragraph}>Hi {name},</Text>
				<Text style={paragraph}>
					Someone recently requested a password change for your personal orion account. If this was you, you can set a new password here:.
				</Text>
				<Section style={btnContainer}>
					<Button style={button} href={url}>
						Reset Password
					</Button>
				</Section>
				<Text style={paragraph}>
					If you feel this email is not for you please ignore or delete this email.
				</Text>
				<Text style={paragraph}>
					Best,
					<br />
					Orion 2024
				</Text>
				<Hr style={hr} />
				<Text style={footer}>Bekasi, Indonesia</Text>
			</Container>
		</Body>
	</Html>
);

export default EmailTemplate;

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
};

const logo = {
	margin: "0 auto",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const btnContainer = {
	textAlign: "center" as const,
};

const button = {
	backgroundColor: "#000000",
	borderRadius: "4px",
	color: "#fff",
	fontSize: "16px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "8px",
};

const hr = {
	borderColor: "#cccccc",
	margin: "20px 0",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
};