import 'dotenv/config'
import express from 'express'
import { Resend } from 'resend'
const app=express(); app.use(express.json());
app.post('/api/contact',async(req,res)=>{const {name,email,subject,message}=req.body||{};if(!name||!email||!subject||!message||!/^\S+@\S+\.\S+$/.test(email))return res.status(400).json({error:'Invalid form data'});if(!process.env.RESEND_API_KEY||!process.env.CONTACT_TO_EMAIL||!process.env.CONTACT_FROM_EMAIL)return res.status(503).json({error:'Email is not configured'});try{const resend=new Resend(process.env.RESEND_API_KEY);await resend.emails.send({from:process.env.CONTACT_FROM_EMAIL,to:process.env.CONTACT_TO_EMAIL,replyTo:email,subject:`Portfolio enquiry: ${subject}`,text:`Name: ${name}\nEmail: ${email}\nProject: ${subject}\n\nMessage:\n${message}\n\nSubmitted: ${new Date().toISOString()}`});res.json({ok:true})}catch{res.status(500).json({error:'Unable to send email'})}});app.listen(process.env.PORT||3001,()=>console.log('Contact API listening'));
