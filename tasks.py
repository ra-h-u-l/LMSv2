from celery import shared_task
import time
from models import *
from mail_service import send_email

@shared_task()
def add(x,y):
    time.sleep(60)
    return x+y

@shared_task(ignore_result = False)
def create_csv_report():
    # gathering data for csv report
    history = UserBookHistory.query.all()
    rawReport = []
    for record in history:
        reportInfo = {}
        reportInfo['user_id'] = record.user_id
        reportInfo['user_name'] = User.query.get(record.user_id).fullName
        reportInfo['book_id'] = record.book_id
        reportInfo['book_name'] = record.book_name
        reportInfo['section_id'] = Books.query.get(record.book_id).section_id
        reportInfo['section_name'] = Sections.query.get(Books.query.get(record.book_id).section_id).section_name
        if record.date_issued:
            reportInfo['date_issued'] = f"{record.date_issued.strftime('%d')}-{record.date_issued.strftime('%b')}-{record.date_issued.strftime('%Y')}"
        else:
            reportInfo['date_issued'] = "NA"

        if record.date_returned:
            reportInfo['date_returned'] = f"{record.date_returned.strftime('%d')}-{record.date_returned.strftime('%b')}-{record.date_returned.strftime('%Y')}"
        else:
            if record.date_issued:
                reportInfo['date_returned'] = "Currently Issued"
            else:
                reportInfo['date_returned'] = "NA"

        if record.date_bought:
            reportInfo['date_bought'] = f"{record.date_bought.strftime('%d')}-{record.date_bought.strftime('%b')}-{record.date_bought.strftime('%Y')}"
        else:
            reportInfo['date_bought'] = "NA"

        if record.is_bought:
            reportInfo['is_bought'] = "Yes"
        else:
            reportInfo['is_bought'] = "No"

        rawReport.append(reportInfo)

    f = open("./downloads/report.csv", "w")
    f.write("User ID,User Name,Book ID,Book Name,Section ID,Section Name,Date Issued,Date Returned,Date Bought,Is Bought\n")
    for record in rawReport:
        f.write(f"{record['user_id']},{record['user_name']},{record['book_id']},{record['book_name']},{record['section_id']},{record['section_name']},{record['date_issued']},{record['date_returned']},{record['date_bought']},{record['is_bought']}\n")

    f.close()

    # time.sleep(20)

    return "report.csv"


@shared_task(ignore_result = False)
def daily_reminder():
    current_time = datetime.now()
    currently_issued_books = CurrentlyIssuedBooks.query.all()

    for record in currently_issued_books:
        time_difference = (current_time - record.date_issued).total_seconds()

        if time_difference > 50:        # 6 days = 518400 seconds
            user = User.query.get(record.user_id)
            book = Books.query.get(record.book_id)

            # email details
            to = user.email
            sub = f"Gentle reminder for returning : {book.book_name}"
            message = f"""
                    <html>
                        <body>
                            <p>Hi <strong>{user.fullName}</strong>!</p>
                            <p>This is a gentle reminder to return the following book:</p>
                            <table style="border: 1px solid black; border-collapse: collapse;">
                                <tr>
                                    <th style="border: 1px solid black; padding: 8px;">Book Name</th>
                                    <td style="border: 1px solid black; padding: 8px;">{book.book_name}</td>
                                </tr>
                                <tr>
                                    <th style="border: 1px solid black; padding: 8px;">Book ID</th>
                                    <td style="border: 1px solid black; padding: 8px;">{book.book_id}</td>
                                </tr>
                                <tr>
                                    <th style="border: 1px solid black; padding: 8px;">Issued Date</th>
                                    <td style="border: 1px solid black; padding: 8px;">{record.date_issued.strftime('%d-%b-%Y')}</td>
                                </tr>
                            </table>
                            <p>Please return it as soon as possible.</p>
                            <p>Thank you!</p>
                        </body>
                    </html>
                """

            send_email(to, sub, message)
    return "Reminder Sent"

# calculate the start and end date of the previous month
def get_previous_month_dates():
    today = datetime.today()
    first_day_current_month = today.replace(day=1)
    last_day_previous_month = first_day_current_month - timedelta(days=1)
    first_day_previous_month = last_day_previous_month.replace(day=1)
    
    return first_day_previous_month, last_day_previous_month


# send monthly activity report
@shared_task(ignore_result = False)
def monthly_activity_report():
    # Get the start and end dates for the previous month
    start_date, end_date = get_previous_month_dates()

    # Query to get records of issued books for the previous month
    history = UserBookHistory.query.filter(UserBookHistory.date_issued.between(start_date, end_date)).all()

    # Query to get records of sold books for the previous month and add them to the history list
    soldBooks = UserBookHistory.query.filter(UserBookHistory.date_bought.between(start_date, end_date)).all()
    if soldBooks:
        for book in soldBooks:
            if book.is_bought:
                history.append(book)
    
    if history:

        content = f"""
                <html>
                    <body>
                        <strong>Hello Admin,</strong>    
                        <br>
                        <p>Please find the below:</p>
                        <center>
                            <h3>Monthly Activity Report</h3>
                            <table border='1' cellpadding='10' cellspacing='0'>
                                <thead>
                                    <tr>
                                        <th>User Id</th>
                                        <th>User Name</th>
                                        <th>Book Id</th>
                                        <th>Book Name</th>
                                        <th>Section Id</th>
                                        <th>Section Name</th>
                                        <th>Date of Issue</th>
                                        <th>Date of Return</th>
                                        <th>Date of Buying</th>
                                        <th>Is Bought</th>
                                    </tr>
                                </thead>
                                <tbody>
        """

        for record in history:
            info = {}
            user = User.query.get(record.user_id)
            book = Books.query.get(record.book_id)
            section = Sections.query.get(book.section_id)

            info["user_id"] = user.id
            info["user_name"] = user.fullName
            info["book_id"] = book.book_id
            info["book_name"] = book.book_name
            info["section_id"] = section.section_id
            info["section_name"] = section.section_name
            if record.date_issued:
                info["date_issued"] = record.date_issued.strftime('%d-%b-%Y')
            else:
                info["date_issued"] = "NA"

            if record.date_returned:
                info["date_returned"] = record.date_returned.strftime('%d-%b-%Y')
            else:
                info["date_returned"] = "NA"

            if record.date_bought:
                info["date_bought"] = record.date_bought.strftime('%d-%b-%Y')
            else:
                info["date_bought"] = "NA"

            if record.is_bought:
                info["is_bought"] = "Yes"
            else:
                info["is_bought"] = "No"

            content += f"""
                        <tr>
                            <td>{info['user_id']}</td>
                            <td>{info['user_name']}</td>
                            <td>{info['book_id']}</td>
                            <td>{info['book_name']}</td>
                            <td>{info['section_id']}</td>
                            <td>{info['section_name']}</td>
                            <td>{info['date_issued']}</td>
                            <td>{info['date_returned']}</td>
                            <td>{info['date_bought']}</td>
                            <td>{info['is_bought']}</td>
                        </tr>
                    """

        content += f"""
                                </tbody>
                            </table>
                        </center>
                    </body>
                </html>
            """

    else:
        content = "<h3>No records found</h3>"

    to = "receiveradmin@gmail.com"
    sub = "Monthly Activity Report"
    message = content
    
    send_email(to, sub, message)

    return "Monthly Activity Report Sent"