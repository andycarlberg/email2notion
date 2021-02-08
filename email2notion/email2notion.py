import uuid
import base64
import email
import mailparser
from imapclient import IMAPClient
from notion.client import NotionClient
from notion.block import PageBlock
from notion.block import TextBlock
from notion.block import PDFBlock
from notion.block import ImageBlock
from notion.collection import CollectionView


def import_pages(mailserver, mailbox, notionaccount, parent_block_id):
    notion_client = NotionClient(notionaccount.token)
    notion_parent_block = notion_client.get_block(parent_block_id)

    with IMAPClient(host=mailserver.host, port=mailserver.port) as imap:
        imap.login(mailserver.user, mailserver.passw)
        imap.select_folder(mailbox)

        messages = imap.search(['UNSEEN'])
        for uid, message_data in imap.fetch(messages, 'RFC822').items():
            email = mailparser.parse_from_bytes(message_data[b'RFC822'])

            new_page = None
            if issubclass(type(notion_parent_block), CollectionView):
                # Don't update views here, it seems to cause a problem with some views
                # and doesn't seem to be necessary for our objective.
                # TODO: Figure out what the actual problem is... - andycarlberg 1/17/2021
                new_page = notion_parent_block.collection.add_row(
                    update_views=False)
            else:
                new_page = notion_parent_block.children.add_new(PageBlock)

            new_page.title = email.subject

            attachments = email.attachments

            for attachment in attachments:
                if attachment['content-disposition'].startswith('attachment'):
                    if attachment['filename'].endswith('.txt') and attachment['mail_content_type'] == 'application/plain':
                        # Since I'm building this specifically to handle
                        # Rocketbook scans, we're just going to hardcode
                        # this as the OCR content for the Notion page.
                        # Also saves us having to figure out how to
                        # import HTML to Notion.
                        #
                        # If someone starts using this in the future, we
                        # can figure out a way to make this more flexible
                        # - andycarlberg 1/17/2021
                        text_bytes = base64.b64decode(attachment['payload'])
                        text_content = text_bytes.decode('utf-8')

                        text_block = new_page.children.add_new(TextBlock)
                        text_block.title = text_content
                    elif attachment['mail_content_type'] == 'application/pdf':
                        pdf_bytes = base64.b64decode(attachment['payload'])
                        temp_file_name = f'/tmp/{uuid.uuid1()}.pdf'
                        temp_file = open(temp_file_name, 'wb')
                        temp_file.write(pdf_bytes)
                        temp_file.close()

                        pdf_block = new_page.children.add_new(PdfBlock)
                        pdf_block.title = attachment['filename']
                        pdf_block.upload_file(temp_file_name)
                    elif attachment['mail_content_type'].startswith('image'):
                        img_bytes = base64.b64decode(attachment['payload'])
                        # This is my hacky way to make a unique filename of
                        # the right extension without parsing the image type
                        # TODO: Parse out image type correctly - andycarlberg 1/17/2021
                        temp_file_name = f'/tmp/{uuid.uuid1()}-{attachment["filename"]}'
                        temp_file = open(temp_file_name, 'wb')
                        temp_file.write(img_bytes)
                        temp_file.close()

                        img_block = new_page.children.add_new(ImageBlock)
                        img_block.title = attachment['filename']
                        img_block.upload_file(temp_file_name)
