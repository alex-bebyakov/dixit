import {Component, OnInit} from "@angular/core";
import {Game} from "../../models/game";
import {SocketService} from "../../services/socket.service";
import {GameMessage} from "../../models/game.message";
import {Observable} from "rxjs";
import {MessageService} from "../../services/message.service";

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
